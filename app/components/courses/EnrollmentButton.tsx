// Handles enrollment with Chapa integration if paid. UX: Loading state, confirmation modal.
// UI: shadcn Button, Dialog for confirmation, lucide for icons.

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
// Assume chapa integration from lib/chapa.ts
import { initializeChapaPayment } from "@/lib/chapa";

interface EnrollmentButtonProps {
  courseId: string;
  price: number;
  isEnrolled: boolean;
}

export function EnrollmentButton({ courseId, price, isEnrolled }: EnrollmentButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleEnroll = async () => {
    if (!session) {
      router.push("/auth/signin");
      return;
    }
    setIsLoading(true);
    try {
      if (price > 0) {
        // Chapa payment
        const paymentUrl = await initializeChapaPayment({
          amount: price,
          currency: "ETB", // Assuming Ethiopian Birr for Chapa; adjust as needed
          email: session.user?.email,
          first_name: session.user?.name?.split(" ")[0] || "",
          last_name: session.user?.name?.split(" ")[1] || "",
          tx_ref: `enroll-${courseId}-${Date.now()}`,
          callback_url: `${window.location.origin}/api/chapa/webhook`, // Handle success
          return_url: `${window.location.origin}/courses/${courseId}?enrolled=true`,
          title: "Course Enrollment",
          description: `Payment for course ${courseId}`,
        });
        window.location.href = paymentUrl;
      } else {
        // Free enrollment: Call API route to create Enrollment
        await fetch(`/api/courses/${courseId}/enroll`, { method: "POST" });
        router.refresh(); // Or use TanStack Query invalidate
        setOpen(false);
      }
    } catch (error) {
      console.error("Enrollment error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isEnrolled) {
    return <Button disabled><CheckCircle className="mr-2 h-4 w-4" /> Enrolled</Button>;
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>{price > 0 ? `Enroll for $${price}` : "Enroll for Free"}</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Enrollment</DialogTitle>
          <DialogDescription>
            {price > 0 ? "You'll be redirected to Chapa for secure payment." : "This course is free. Proceed to enroll?"}
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleEnroll} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}