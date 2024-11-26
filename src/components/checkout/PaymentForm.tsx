import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { trackCheckoutStep, trackCheckoutCompleted } from "@/lib/analytics/ecommerce";
import { createShopifyOrder } from "@/lib/shopify/createOrder";
import { formatPhoneForShopify } from "@/lib/utils/phoneFormatter";

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

  const createSampleRequest = async () => {
    if (!user) throw new Error("User not authenticated");

    const shippingAddress = localStorage.getItem('shipping_address') || '';
    const shippingCity = localStorage.getItem('shipping_city') || '';
    const shippingState = localStorage.getItem('shipping_state') || '';
    const shippingZip = localStorage.getItem('shipping_zip') || '';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    const phone = localStorage.getItem('phone') || '';

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

    if (!stripe || !elements || !user) {
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
        throw paymentError;
      }

      // Get Shopify variant IDs for the products
      const { data: shopifyProducts, error: shopifyError } = await supabase
        .from('shopify_products')
        .select('shopify_variant_id, product_id')
        .in('product_id', items.map(item => item.id));

      if (shopifyError) throw shopifyError;

      // Create a map of our product IDs to Shopify variant IDs
      const variantMap = new Map(
        shopifyProducts?.map(sp => [sp.product_id, sp.shopify_variant_id]) || []
      );

      const phone = localStorage.getItem('phone') || '';
      const formattedPhone = formatPhoneForShopify(phone);

      // Create order in Shopify with the correct variant IDs
      await createShopifyOrder({
        orderId,
        customer: {
          first_name: localStorage.getItem('firstName') || '',
          last_name: localStorage.getItem('lastName') || '',
          email: user.email,
          phone: formattedPhone,
        },
        shippingAddress: {
          address1: localStorage.getItem('shipping_address') || '',
          address2: localStorage.getItem('shipping_address2') || undefined,
          city: localStorage.getItem('shipping_city') || '',
          province: localStorage.getItem('shipping_state') || '',
          zip: localStorage.getItem('shipping_zip') || '',
          phone: formattedPhone,
        },
        lineItems: items.map(item => ({
          variant_id: variantMap.get(item.id) || '',
          quantity: item.quantity || 1,
          price: item.from_price
        }))
      });

      // Track successful checkout with email
      trackCheckoutCompleted(
        orderId,
        items,
        {
          firstName: localStorage.getItem('firstName'),
          lastName: localStorage.getItem('lastName'),
          phone: formattedPhone,
          address1: localStorage.getItem('shipping_address'),
          city: localStorage.getItem('shipping_city'),
          state: localStorage.getItem('shipping_state'),
          zipCode: localStorage.getItem('shipping_zip'),
        },
        total,
        shippingCost,
        user.email
      );

      clearCart();
      
      // Navigate with both orderId and payment intent ID
      navigate(`/checkout/success?order_id=${orderId}&payment_intent=${paymentIntent?.id}`);

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
        className="w-full bg-primary hover:bg-primary-dark"
      >
        {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
      </Button>
    </form>
  );
};

export default PaymentForm;