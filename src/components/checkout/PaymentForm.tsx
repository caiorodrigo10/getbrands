import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

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

  const createSampleRequest = async () => {
    if (!user) throw new Error("User not authenticated");

    const shippingAddress = localStorage.getItem('shipping_address') || '';
    const shippingCity = localStorage.getItem('shipping_city') || '';
    const shippingState = localStorage.getItem('shipping_state') || '';
    const shippingZip = localStorage.getItem('shipping_zip') || '';

    const { data: sampleRequest, error: sampleRequestError } = await supabase
      .from('sample_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZip,
      })
      .select()
      .single();

    if (sampleRequestError) throw sampleRequestError;

    const sampleRequestProducts = items.map(item => ({
      sample_request_id: sampleRequest.id,
      product_id: item.id,
    }));

    const { error: productsError } = await supabase
      .from('sample_request_products')
      .insert(sampleRequestProducts);

    if (productsError) throw productsError;

    return sampleRequest.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = await createSampleRequest();

      const { error: paymentError } = await stripe.confirmPayment({
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
                country: 'BR',
              },
            },
          },
        },
      });

      if (paymentError) {
        throw paymentError;
      }

      clearCart();
      navigate('/checkout/success');

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
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
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing}
        className="w-full bg-primary hover:bg-primary-dark"
      >
        {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </Button>
    </form>
  );
};

export default PaymentForm;