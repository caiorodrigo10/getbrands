import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;
const SHOPIFY_SHOP_DOMAIN = Deno.env.get('SHOPIFY_SHOP_DOMAIN')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderLineItem {
  variant_id: string;
  quantity: number;
  price: number;
}

interface ShippingAddress {
  first_name: string;
  last_name: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  zip: string;
  country: string;
  phone: string;
}

interface OrderData {
  orderId: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  line_items: OrderLineItem[];
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  financial_status: "paid" | "pending" | "refunded";
  shipping_cost?: number;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData } = await req.json();

    console.log('Creating Shopify order with data:', orderData);

    // Format shipping lines for Shopify with additional details
    const shippingLines = orderData.shipping_cost ? [{
      title: "Standard Shipping",
      price: orderData.shipping_cost.toFixed(2),
      code: "CALCULATED_BY_SYSTEM",
      source: "Lovable System"
    }] : [];

    console.log('Shipping lines configuration:', shippingLines);

    const orderPayload = {
      order: {
        ...orderData,
        send_receipt: true,
        inventory_behaviour: 'decrement_ignoring_policy',
        email: orderData.customer.email,
        customer: {
          first_name: orderData.customer.first_name,
          last_name: orderData.customer.last_name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
        },
        shipping_lines: shippingLines,
      },
    };

    console.log('Final order payload:', JSON.stringify(orderPayload, null, 2));

    const response = await fetch(`https://${SHOPIFY_SHOP_DOMAIN}/admin/api/2024-01/orders.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify(orderPayload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Shopify API error:', errorData);
      throw new Error(`Shopify API error: ${JSON.stringify(errorData)}`);
    }

    const data = await response.json();
    console.log('Shopify order created:', data);

    return new Response(
      JSON.stringify({ success: true, shopifyOrder: data.order }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error creating Shopify order:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});