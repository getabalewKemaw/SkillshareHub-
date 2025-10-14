"use client"

// Handles enrollment with Chapa integration if paid. UX: Loading state, confirmation modal.
// UI: shadcn Button, Dialog for confirmation, lucide for icons.

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Loader2, CheckCircle } from "lucide-react";
import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface EnrollmentButtonProps {
  courseId: string;
  price: number;
  isEnrolled?: boolean;
}

export function EnrollmentButton({ courseId, price, isEnrolled = false }: EnrollmentButtonProps) {
  const { data: session } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleEnroll = async () => {
    if (!session) {
      router.push("/login");
      return;
    }
    
    setIsLoading(true);
    
    try {
      if (price > 0) {
        // Paid course - Initialize payment
        const res = await fetch("/api/payment/initialize", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId,
            amount: price,
            currency: "ETB",
          }),
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to initialize payment");
        }

        const { checkoutUrl } = await res.json();
        
        // Redirect to payment page
        window.location.href = checkoutUrl;
      } else {
        // Free course - Enroll directly
        const res = await fetch(`/api/courses/${courseId}/enroll`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        });

        if (!res.ok) {
          const errData = await res.json();
          throw new Error(errData.error || "Failed to enroll");
        }

        setSuccess(true);
        setTimeout(() => {
          setOpen(false);
          router.refresh();
        }, 1500);
      }
    } catch (err) {
      console.error("Enrollment error:", err);
      alert(err instanceof Error ? err.message : "Failed to enroll");
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
        <Button size="lg" className="w-full">
          {price > 0 ? `Enroll for ${price} ETB` : "Enroll for Free"}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {success ? "Successfully Enrolled!" : "Confirm Enrollment"}
          </DialogTitle>
          <DialogDescription>
            {success ? (
              "You have been enrolled in this course. Redirecting..."
            ) : price > 0 ? (
              "You'll be redirected to the payment gateway to complete your enrollment."
            ) : (
              "This course is free. Click confirm to enroll now."
            )}
          </DialogDescription>
        </DialogHeader>
        {success ? (
          <div className="flex items-center justify-center py-6">
            <CheckCircle className="h-16 w-16 text-green-500" />
          </div>
        ) : (
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleEnroll} disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm"
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    </Dialog>
  );
}