import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import {
  PaymentElement,
  useStripe,
  useElements
} from "@stripe/react-stripe-js";

interface PaymentFormProps {
  clientSecret: string;
  total: number;
  shippingCost: number;
  discountAmount: number;
}

export const PaymentForm = ({ clientSecret, total, shippingCost, discountAmount }: PaymentFormProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const stripe = useStripe();
  const elements = useElements();
  const { clearCart } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setIsLoading(true);

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
      });

      if (paymentError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: paymentError.message || "An error occurred during payment",
        });
        return;
      }

      // If we get here, it means the user closed the modal or there was a redirect
      // The actual success/failure will be handled by the return_url
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process payment",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <PaymentElement />
      <Button 
        type="submit" 
        disabled={isLoading || !stripe} 
        className="w-full"
      >
        {isLoading ? "Processing..." : `Pay ${new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(total)}`}
      </Button>
    </form>
  );
};