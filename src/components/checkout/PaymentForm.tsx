import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCreateSampleRequest } from "./payment/useCreateSampleRequest";
import { PaymentFormButton } from "./payment/PaymentFormButton";
import { trackEvent } from "@/lib/analytics";
import { useToast } from "@/components/ui/use-toast";

export const PaymentForm = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { createRequest } = useCreateSampleRequest();
  const { toast } = useToast();

  const total = items.reduce((sum, item) => sum + item.from_price * item.quantity, 0);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user?.id || !user?.email) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "User information is missing"
      });
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = await createRequest({
        userId: user.id,
        items,
        shippingCost: 0,
        subtotal: total,
        total: total
      });

      trackEvent('purchase_completed', {
        orderId,
        total
      });

      clearCart();
      navigate(`/checkout/success?order=${orderId}`);
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Payment failed. Please try again."
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentFormButton isProcessing={isProcessing} isDisabled={false} total={total} />
    </form>
  );
};