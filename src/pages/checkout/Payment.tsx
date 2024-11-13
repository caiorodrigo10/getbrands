import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import type { Stripe, StripeElementsOptions } from "@stripe/stripe-js";
import { 
  Elements, 
  PaymentElement, 
  useStripe, 
  useElements
} from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useShippingCalculation } from "@/hooks/useShippingCalculation";

// Initialize Stripe with the public key
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY || '');

const CheckoutForm = ({ clientSecret, total }: { clientSecret: string; total: number }) => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
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
        className="w-full"
      >
        {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </Button>
    </form>
  );
};

const Payment = () => {
  const { items } = useCart();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedCountry] = useState("BR");
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
            amount: Math.round(total * 100), // Incluindo o frete no valor total
            currency: 'brl'
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

    if (total > 0 && !isLoadingShipping) {
      createPaymentIntent();
    }
  }, [total, toast, isLoadingShipping]);

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
    <div className="max-w-md mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>Enter your payment details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Shipping:</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="pt-2 border-t">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
          <Elements stripe={stripePromise} options={options}>
            <CheckoutForm clientSecret={clientSecret} total={total} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
