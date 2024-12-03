import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import type { StripeElementsOptions } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { useShippingCalculation } from "@/hooks/useShippingCalculation";
import { PaymentForm } from "@/components/checkout/PaymentForm";
import PaymentSummary from "@/components/checkout/PaymentSummary";
import { calculateOrderSubtotal } from "@/lib/orderCalculations";

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const Payment = () => {
  const { items } = useCart();
  const { toast } = useToast();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [selectedCountry] = useState("USA");
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  
  const totalItems = items.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  const { data: shippingCost = 0, isLoading: isLoadingShipping } = useShippingCalculation(
    selectedCountry,
    totalItems
  );

  const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
  const total = Math.max(subtotal + (shippingCost || 0) - discountAmount, 0.01); // Ensure minimum amount of 0.01

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        description: "Please enter a coupon code",
      });
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const { data: couponData, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !couponData) {
        toast({
          variant: "destructive",
          description: "Invalid coupon code",
        });
        setDiscountAmount(0);
        return;
      }

      const now = new Date();
      const validFrom = couponData.valid_from ? new Date(couponData.valid_from) : null;
      const validUntil = couponData.valid_until ? new Date(couponData.valid_until) : null;

      if (
        (validFrom && now < validFrom) || 
        (validUntil && now > validUntil)
      ) {
        toast({
          variant: "destructive",
          description: "This coupon has expired or is not yet valid",
        });
        setDiscountAmount(0);
        return;
      }

      setDiscountAmount(Number(couponData.discount_amount));
      toast({
        description: "Coupon applied successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error validating coupon",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  useEffect(() => {
    const createPaymentIntent = async () => {
      try {
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
            discountAmount: discountAmount
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

    if (items.length > 0 && !isLoadingShipping) {
      createPaymentIntent();
    }
  }, [items, toast, isLoadingShipping, total, shippingCost, subtotal, discountAmount]);

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
          <Elements stripe={stripePromise} options={options}>
            <PaymentForm 
              clientSecret={clientSecret} 
              total={total} 
              shippingCost={shippingCost}
              discountAmount={discountAmount}
            />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payment;
