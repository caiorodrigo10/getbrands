import { useState } from "react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { createOrder } from "@/lib/utils/paymentUtils";
import { PaymentFormButton } from "./payment/PaymentFormButton";
import { useCreateSampleRequest } from "./payment/useCreateSampleRequest";
import { trackOrderCompleted, trackCheckoutStepCompleted } from "@/lib/analytics/events/checkout";

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
  const { createRequest } = useCreateSampleRequest();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user?.id || !user?.email) {
      return;
    }

    setIsProcessing(true);

    try {
      const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
      const orderId = await createRequest({
        userId: user.id,
        items,
        shippingCost,
        subtotal,
        total
      });

      const shippingAddress = {
        address1: localStorage.getItem('shipping_address') || '',
        address2: localStorage.getItem('shipping_address2') || '',
        city: localStorage.getItem('shipping_city') || '',
        state: localStorage.getItem('shipping_state') || '',
        zipCode: localStorage.getItem('shipping_zip') || '',
        country: 'US'
      };

      const useSameForBilling = localStorage.getItem('useSameForBilling') === 'true';
      const billingAddress = useSameForBilling ? shippingAddress : {
        address1: localStorage.getItem('billing_address') || '',
        address2: localStorage.getItem('billing_address2') || '',
        city: localStorage.getItem('billing_city') || '',
        state: localStorage.getItem('billing_state') || '',
        zipCode: localStorage.getItem('billing_zip') || '',
        country: 'US'
      };

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
                line1: billingAddress.address1,
                line2: billingAddress.address2,
                city: billingAddress.city,
                state: billingAddress.state,
                postal_code: billingAddress.zipCode,
                country: 'US',
              },
            },
          },
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (paymentError) {
        throw paymentError;
      }

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

      // Track successful order completion
      await trackOrderCompleted({
        orderId,
        total,
        subtotal,
        shippingCost,
        customerEmail: user.email,
        customerName: `${localStorage.getItem('firstName')} ${localStorage.getItem('lastName')}`,
        paymentMethod: 'credit_card',
        shippingAddress,
        billingAddress: useSameForBilling ? undefined : billingAddress,
        products: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity || 1,
          price: item.from_price,
          category: item.category,
          image_url: item.image_url
        }))
      });

      // Track payment step completion
      await trackCheckoutStepCompleted('payment', {
        orderId,
        total,
        subtotal,
        shippingCost,
        customerEmail: user.email,
        products: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity || 1,
          price: item.from_price
        }))
      });

      clearCart();
      navigate(`/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent?.id}`);

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Payment Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred. Please try again.",
      });
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
        isDisabled={!stripe || isProcessing}
        total={total}
      />
    </form>
  );
};

export default PaymentForm;