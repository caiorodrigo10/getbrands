import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const CheckoutForm = ({ clientSecret }: { clientSecret: string }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${window.location.origin}/checkout/success`,
      },
    });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "An error occurred during payment.",
      });
    } else {
      clearCart();
      navigate("/checkout/success");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={!stripe} 
        className="w-full"
      >
        Pay Now
      </Button>
    </form>
  );
};

const Payment = () => {
  const { items } = useCart();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  const total = items.reduce((sum, item) => sum + item.from_price * item.quantity, 0);

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { amount: total * 100 }, // Convert to cents
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

    if (total > 0) {
      createPaymentIntent();
    }
  }, [total, toast]);

  if (!clientSecret) {
    return <div>Loading...</div>;
  }

  const options: Parameters<typeof Elements>[0]['options'] = {
    clientSecret,
    appearance: {
      theme: 'stripe',
    },
  };

  return (
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>Enter your payment details below</CardDescription>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm clientSecret={clientSecret} />
          </Elements>
        </CardContent>
        <CardFooter className="flex justify-between">
          <span>Total</span>
          <span className="font-semibold">{formatCurrency(total)}</span>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Payment;