import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/utils/paymentUtils";
import { PaymentFormButton } from "./payment/PaymentFormButton";
import { useCreateSampleRequest } from "./payment/useCreateSampleRequest";

interface PaymentFormProps {
  clientSecret: string;
  total: number;
  shippingCost: number;
}

const PaymentForm = ({ clientSecret, total, shippingCost }: PaymentFormProps) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, clearCart } = useCart();
  const { user } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);
  const [hasStartedSubmission, setHasStartedSubmission] = useState(false);
  const { createRequest } = useCreateSampleRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Prevent multiple submissions
    if (isProcessing || hasStartedSubmission) {
      console.log('Preventing duplicate submission');
      return;
    }

    if (!stripe || !elements || !user?.id || !user?.email) {
      return;
    }

    setIsProcessing(true);
    setHasStartedSubmission(true);

    try {
      const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
      
      // Create the sample request first
      const orderId = await createRequest({
        userId: user.id,
        items,
        shippingCost,
        subtotal,
        total
      });

      // Then confirm the payment
      const { error: paymentError, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: 'if_required',
        confirmParams: {
          payment_method_data: {
            billing_details: {
              name: `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`,
              email: user.email,
              phone: localStorage.getItem('phone') || undefined,
              address: {
                line1: localStorage.getItem('shipping_address') || undefined,
                city: localStorage.getItem('shipping_city') || undefined,
                state: localStorage.getItem('shipping_state') || undefined,
                postal_code: localStorage.getItem('shipping_zip') || undefined,
                country: 'US',
              },
            },
          },
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (paymentError) {
        if (paymentError.type === 'validation_error' && paymentError.code === 'invalid_zip') {
          throw new Error("Please verify that the ZIP code is in the correct format (e.g., 12345 or 12345-678)");
        }
        throw paymentError;
      }

      let shopifyError = false;
      try {
        await createOrder({
          user: {
            id: user.id,
            email: user.email
          },
          items,
          total,
          shippingCost,
          orderId,
        });
      } catch (orderError: any) {
        console.error('Error creating Shopify order:', orderError);
        shopifyError = true;
      }

      clearCart();
      
      // Redirect to success page with additional parameter if there was a Shopify error
      navigate(
        `/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent?.id}${shopifyError ? '&shopify_error=true' : ''}`
      );

    } catch (error: any) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
      // Reset submission state so user can try again
      setHasStartedSubmission(false);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <PaymentElement />
      </div>
      <PaymentFormButton
        isProcessing={isProcessing}
        isDisabled={!stripe || isProcessing || hasStartedSubmission}
        total={total}
      />
    </form>
  );
};

export default PaymentForm;