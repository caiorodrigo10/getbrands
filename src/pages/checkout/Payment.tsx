import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

const stripePromise = loadStripe("pk_test_51QKiKUALHp5HR9166VeZiOJ6scDCMG23Zj82rMJjmB960htXAzAlh8hX5gfUDwrCraxiCftRorhs2MLpLbG4YNej00sMWFLqA3");

const Payment = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { items, clearCart } = useCart();

  const total = items.reduce((sum, item) => sum + item.from_price * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const stripe = await stripePromise;
      if (!stripe) throw new Error("Stripe failed to load");

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-checkout`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          items,
          success_url: `${window.location.origin}/checkout/success`,
          cancel_url: `${window.location.origin}/checkout/payment`,
        }),
      });

      const { sessionId, error } = await response.json();
      
      if (error) throw new Error(error);
      
      const { error: stripeError } = await stripe.redirectToCheckout({
        sessionId,
      });

      if (stripeError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: stripeError.message,
        });
      }
    } catch (error) {
      console.error("Payment error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem processing your payment. Please try again.",
      });
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Payment</h2>

        <Card>
          <CardHeader>
            <CardTitle>Order Summary</CardTitle>
            <CardDescription>Review your order details</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span>
                <span>{formatCurrency(total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>Free</span>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between font-semibold">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </CardFooter>
        </Card>

        <div className="flex justify-end pt-6">
          <Button
            onClick={handleCheckout}
            className="w-full md:w-auto"
          >
            Proceed to Payment
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Payment;