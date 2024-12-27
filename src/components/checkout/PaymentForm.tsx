import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { createOrder } from "@/lib/utils/paymentUtils";
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
  const { clearCart, items } = useCart();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements || !user) {
      return;
    }

    setIsLoading(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error("No active session found");
      }

      // Create sample request first
      const { data: sampleRequest, error: sampleRequestError } = await supabase
        .from('sample_requests')
        .insert({
          user_id: user.id,
          status: 'pending',
          shipping_address: localStorage.getItem('shipping_address'),
          shipping_city: localStorage.getItem('shipping_city'),
          shipping_state: localStorage.getItem('shipping_state'),
          shipping_zip: localStorage.getItem('shipping_zip'),
          billing_address: localStorage.getItem('billing_address') || localStorage.getItem('shipping_address'),
          billing_city: localStorage.getItem('billing_city') || localStorage.getItem('shipping_city'),
          billing_state: localStorage.getItem('billing_state') || localStorage.getItem('shipping_state'),
          billing_zip: localStorage.getItem('billing_zip') || localStorage.getItem('shipping_zip'),
          first_name: localStorage.getItem('firstName'),
          last_name: localStorage.getItem('lastName'),
          payment_method: 'credit_card',
          shipping_cost: shippingCost,
          subtotal: total - shippingCost,
          total: total
        })
        .select()
        .single();

      if (sampleRequestError) throw sampleRequestError;

      // Insert sample request products
      const { error: productsError } = await supabase
        .from('sample_request_products')
        .insert(
          items.map(item => ({
            sample_request_id: sampleRequest.id,
            product_id: item.id,
            quantity: item.quantity || 1,
            unit_price: item.from_price
          }))
        );

      if (productsError) throw productsError;

      // Confirm payment with Stripe
      const { error: paymentError } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/checkout/success`,
        },
        redirect: 'if_required',
      });

      if (paymentError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: paymentError.message || "An error occurred during payment",
        });
        return;
      }

      // Create Shopify order
      try {
        await createOrder({
          user: {
            id: user.id,
            email: user.email || ''
          },
          items,
          total,
          shippingCost,
          orderId: sampleRequest.id
        });
      } catch (shopifyError: any) {
        console.error('Error creating Shopify order:', shopifyError);
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Order processed but there was an issue syncing with our inventory system. Our team will handle this manually.",
        });
      }

      // Silently clear cart without showing notification
      await clearCart(true);
      
      // Navigate to success page with order details
      navigate('/checkout/success', {
        state: {
          orderId: sampleRequest.id,
          orderDetails: {
            id: sampleRequest.id,
            first_name: localStorage.getItem('firstName'),
            last_name: localStorage.getItem('lastName'),
            shipping_address: localStorage.getItem('shipping_address'),
            shipping_city: localStorage.getItem('shipping_city'),
            shipping_state: localStorage.getItem('shipping_state'),
            shipping_zip: localStorage.getItem('shipping_zip'),
            products: items.map(item => ({
              product: {
                id: item.id,
                name: item.name,
                image_url: item.image_url,
                from_price: item.from_price
              },
              quantity: item.quantity || 1,
              unit_price: item.from_price
            })),
            subtotal: total - shippingCost,
            shipping_cost: shippingCost,
            total: total
          }
        },
        replace: true
      });

    } catch (error: any) {
      console.error('Error processing payment:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to process payment",
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