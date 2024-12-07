import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useCreateSampleRequest } from "./payment/useCreateSampleRequest";
import { usePaymentValidation } from "./payment/usePaymentValidation";
import { PaymentFormButton } from "./payment/PaymentFormButton";
import { trackEvent } from "@/lib/analytics";

export const PaymentForm = () => {
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const { createSampleRequest } = useCreateSampleRequest();
  const { validatePayment } = usePaymentValidation();

  useEffect(() => {
    if (!items.length) {
      navigate('/catalog');
    }
  }, [items, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!user?.id || !user?.email) {
      toast.error('User information is missing');
      return;
    }

    setIsProcessing(true);

    try {
      // Validate payment details
      const isValid = await validatePayment();
      if (!isValid) {
        throw new Error('Payment validation failed');
      }

      // Create the sample request
      const sampleRequest = await createSampleRequest({
        user: {
          id: user.id,
          email: user.email
        },
        items
      });

      // Track the purchase event
      trackEvent('purchase_completed', {
        orderId: sampleRequest.id,
        total: items.reduce((sum, item) => sum + item.from_price * item.quantity, 0)
      });

      // Clear cart and redirect to success page
      clearCart();
      navigate(`/checkout/success?order=${sampleRequest.id}`);
    } catch (error) {
      console.error('Payment error:', error);
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentFormButton isProcessing={isProcessing} />
    </form>
  );
};