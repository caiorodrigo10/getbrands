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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !user) {
      return;
    }

    setIsProcessing(true);

    try {
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
          shipping: {
            name: 'Frete padrão',
            address: {
              line1: "Endereço de entrega",
              city: "Cidade",
              state: "Estado",
              postal_code: "00000-000",
              country: 'BR',
            },
          },
        },
      });

      if (paymentError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: paymentError.message || "An error occurred during payment.",
        });
      } else {
        const { error: orderError } = await supabase
          .from('sample_requests')
          .insert({
            user_id: user.id,
            product_id: items[0]?.id,
            status: 'pending',
            shipping_address: "Endereço de entrega",
            shipping_city: "Cidade",
            shipping_state: "Estado",
            shipping_zip: "00000-000",
            tracking_number: null
          });

        if (orderError) throw orderError;

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

export default PaymentForm;