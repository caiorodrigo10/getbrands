import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { trackCheckoutStep } from "@/lib/analytics/ecommerce";
import { createOrder } from "@/lib/utils/paymentUtils";

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

  useEffect(() => {
    trackCheckoutStep(3, items, { total, shipping_cost: shippingCost });
  }, [items, total, shippingCost]);

  const validateZipCode = (zip: string | null) => {
    if (!zip) return false;
    // Basic ZIP code validation for Brazil (CEP) and US formats
    const brZipRegex = /^\d{5}-?\d{3}$/;
    const usZipRegex = /^\d{5}(-\d{4})?$/;
    return brZipRegex.test(zip) || usZipRegex.test(zip);
  };

  const createSampleRequest = async () => {
    if (!user?.id || !user?.email) throw new Error("User not authenticated");

    const shippingAddress = localStorage.getItem('shipping_address') || '';
    const shippingCity = localStorage.getItem('shipping_city') || '';
    const shippingState = localStorage.getItem('shipping_state') || '';
    const shippingZip = localStorage.getItem('shipping_zip') || '';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    const phone = localStorage.getItem('phone') || '';
    const useSameForBilling = localStorage.getItem('useSameForBilling') === 'true';

    // Validate ZIP code
    if (!validateZipCode(shippingZip)) {
      throw new Error("Invalid shipping ZIP code format");
    }

    const billingAddress = useSameForBilling 
      ? shippingAddress 
      : localStorage.getItem('billing_address') || '';
    const billingCity = useSameForBilling 
      ? shippingCity 
      : localStorage.getItem('billing_city') || '';
    const billingState = useSameForBilling 
      ? shippingState 
      : localStorage.getItem('billing_state') || '';
    const billingZip = useSameForBilling 
      ? shippingZip 
      : localStorage.getItem('billing_zip') || '';

    // Validate billing ZIP if different
    if (!useSameForBilling && !validateZipCode(billingZip)) {
      throw new Error("Invalid billing ZIP code format");
    }

    const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);

    const { data: sampleRequest, error: sampleRequestError } = await supabase
      .from('sample_requests')
      .insert({
        user_id: user.id,
        status: 'pending',
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZip,
        billing_address: billingAddress,
        billing_city: billingCity,
        billing_state: billingState,
        billing_zip: billingZip,
        first_name: firstName,
        last_name: lastName,
        payment_method: 'credit_card',
        shipping_cost: shippingCost,
        subtotal: subtotal,
        total: total
      })
      .select()
      .single();

    if (sampleRequestError) throw sampleRequestError;

    const sampleRequestProducts = items.map(item => ({
      sample_request_id: sampleRequest.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      unit_price: item.from_price
    }));

    const { error: productsError } = await supabase
      .from('sample_request_products')
      .insert(sampleRequestProducts);

    if (productsError) throw productsError;

    return sampleRequest.id;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user?.id || !user?.email) {
      return;
    }

    setIsProcessing(true);

    try {
      const orderId = await createSampleRequest();

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
                country: 'BR',
              },
            },
          },
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (paymentError) {
        if (paymentError.type === 'validation_error' && paymentError.code === 'invalid_zip') {
          throw new Error("Por favor, verifique se o CEP está no formato correto (ex: 12345-678)");
        }
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

      clearCart();
      
      navigate(`/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent?.id}`);

    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Erro no pagamento",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado. Por favor, tente novamente.",
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
        {isProcessing ? "Processando..." : `Pagar ${formatCurrency(total)}`}
      </Button>
    </form>
  );
};

export default PaymentForm;