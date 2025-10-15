// Standalone for payments if needed outside enrollment. UX: Secure redirect info.
// UI: shadcn Button, lucide for lock icon.

import { Button } from "@/components/ui/button";
import { Lock } from "lucide-react";
import { initializePayment as initializeChapaPayment } from "@/lib/chapa";

interface ChapaButtonProps {
  amount: number;
  txRef: string;
  email: string;
  firstName: string;
  lastName: string;
  callbackUrl: string;
  returnUrl: string;
}

export function ChapaButton({ amount, txRef, email, firstName, lastName, callbackUrl, returnUrl }: ChapaButtonProps) {
  const handlePayment = async () => {
    const response = await initializeChapaPayment({
      amount,
      currency: 'ETB',
      email,
      first_name: firstName,
      last_name: lastName,
      tx_ref: txRef,
      callback_url: callbackUrl,
      return_url: returnUrl,
    });
    if (response.data?.checkout_url) {
      window.location.href = response.data.checkout_url;
    }
  };

  return (
    <Button onClick={handlePayment}>
      <Lock className="mr-2 h-4 w-4" /> Pay with Chapa
    </Button>
  );
}