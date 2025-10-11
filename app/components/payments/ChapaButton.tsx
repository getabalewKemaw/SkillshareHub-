// Standalone for payments if needed outside enrollment. UX: Secure redirect info.
// UI: shadcn Button, lucide for lock icon.

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { initializeChapaPayment } from "@/lib/chapa";

interface ChapaButtonProps {
  amount: number;
  txRef: string;
  // Other Chapa params
}

export function ChapaButton({ amount, txRef }: ChapaButtonProps) {
  const handlePayment = async () => {
    const paymentUrl = await initializeChapaPayment({
      amount,
      tx_ref: txRef,
      // Fill other params
    });
    window.location.href = paymentUrl;
  };

  return (
    <Button onClick={handlePayment}>
      <Lock className="mr-2 h-4 w-4" /> Pay with Chapa
    </Button>
  );
}