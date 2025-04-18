import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useShippingCalculation } from "@/hooks/useShippingCalculation";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import { useCouponValidation } from "@/hooks/useCouponValidation";
import { useToast } from "@/components/ui/use-toast";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const { items } = useCart();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedCountry] = useState("USA");
  const { toast } = useToast();
  const [isCreatingPaymentIntent, setIsCreatingPaymentIntent] = useState(false);
  
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const { data: shippingCost = 0, isLoading: isLoadingShipping } = useShippingCalculation(
    selectedCountry,
    totalItems
  );

  const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
  
  const {
    couponCode,
    setCouponCode,
    discountAmount,
    isValidatingCoupon,
    validateCoupon
  } = useCouponValidation(subtotal);

  // Ensure total is never negative and at least 0.01
  const total = Math.max(subtotal + (shippingCost || 0) - discountAmount, 0.01);

  useEffect(() => {
    const createPaymentIntent = async () => {
      if (isCreatingPaymentIntent) return;
      
      try {
        setIsCreatingPaymentIntent(true);
        
        console.log('Creating payment intent with:', {
          amount: total,
          shipping_amount: shippingCost,
          subtotal: subtotal,
          discountAmount: discountAmount
        });

        const { data, error } = await supabase.functions.invoke('create-payment-intent', {
          body: { 
            amount: total,
            currency: 'usd',
            shipping_amount: shippingCost,
            items: items.map(item => ({
              product_id: item.id,
              quantity: item.quantity || 1,
              unit_price: item.from_price
            })),
            subtotal: subtotal,
            total: total,
            discountAmount: discountAmount,
            metadata: {
              discount_amount: discountAmount,
              original_amount: subtotal + shippingCost,
              shipping_cost: shippingCost
            }
          },
        });

        if (error) {
          console.error('Error creating payment intent:', error);
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to create payment intent. Please try again.",
          });
          throw error;
        }
        
        if (!data?.clientSecret) {
          console.error('No client secret returned');
          toast({
            variant: "destructive",
            title: "Error",
            description: "Invalid payment configuration. Please try again.",
          });
          throw new Error("No client secret returned");
        }

        console.log('Payment intent created successfully with discount:', discountAmount);
        setClientSecret(data.clientSecret);
      } catch (error) {
        console.error('Payment error:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to setup payment. Please try again.",
        });
      } finally {
        setIsCreatingPaymentIntent(false);
      }
    };

    if (items.length > 0 && !isLoadingShipping && !clientSecret) {
      createPaymentIntent();
    }
  }, [items, isLoadingShipping, total, shippingCost, subtotal, discountAmount, toast]);

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
      variables: {
        colorPrimary: '#0F172A',
        colorBackground: '#ffffff',
        colorText: '#1e293b',
        colorDanger: '#ef4444',
        fontFamily: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        spacingUnit: '4px',
        borderRadius: '6px',
      },
    },
  };

  return (
    <div className="max-w-2xl mx-auto py-6">
      <Card>
        <CardHeader>
          <CardTitle>Complete Your Payment</CardTitle>
          <CardDescription>Enter your payment details below</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <PaymentSummary 
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
              discount={discountAmount}
            />
            <div className="mt-4 flex gap-2">
              <Input
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="uppercase"
              />
              <Button 
                onClick={validateCoupon}
                disabled={isValidatingCoupon || !couponCode.trim()}
                variant="outline"
              >
                {isValidatingCoupon ? "Validating..." : "Apply"}
              </Button>
            </div>
          </div>
          {clientSecret && (
            <Elements stripe={stripePromise} options={options}>
              <PaymentForm 
                clientSecret={clientSecret} 
                total={total} 
                shippingCost={shippingCost}
                discountAmount={discountAmount}
              />
            </Elements>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;