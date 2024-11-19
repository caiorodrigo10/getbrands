import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useShippingCalculation } from "@/hooks/useShippingCalculation";
import PaymentForm from "@/components/checkout/PaymentForm";
import PaymentSummary from "@/components/checkout/PaymentSummary";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const Payment = () => {
  const { items } = useCart();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedCountry] = useState("USA");
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const { data: shippingCost = 0, isLoading: isLoadingShipping } = useShippingCalculation(
    selectedCountry,
    totalItems
  );

  const subtotal = items.reduce((sum, item) => sum + item.from_price * item.quantity, 0);
  const total = subtotal + (shippingCost || 0);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            amount: Math.round(total * 100),
            currency: 'usd',
            shipping_amount: Math.round(shippingCost * 100)
          },
        });

        if (error) throw error;
        if (!data?.clientSecret) throw new Error("No client secret returned");

        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "There was a problem setting up the payment. Please try again.",
        });
      }
    };

    if (total > 0 && !isLoadingShipping && shippingCost !== undefined) {
      createPaymentIntent();
    }
  }, [total, toast, isLoadingShipping, shippingCost, subtotal]);

  if (!clientSecret || isLoadingShipping) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>Enter your payment details below</CardDescription>
        </CardHeader>
        <CardContent>
          <PaymentSummary 
            subtotal={subtotal}
            shippingCost={shippingCost}
            total={total}
          />
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm 
              clientSecret={clientSecret} 
              total={total} 
              shippingCost={shippingCost}
            />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;