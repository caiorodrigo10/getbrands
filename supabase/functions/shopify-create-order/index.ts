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

    console.log('Creating Shopify order with data:', {
      ...orderData,
      customer: {
        ...orderData.customer,
        email: '***@***.com' // Mask email for security
      }
    });

    // Validate required data
    if (!orderData.customer?.email || !orderData.line_items?.length) {
      throw new Error('Missing required order data');
    }

    // Ensure shipping cost is a valid number
    const shippingCost = typeof orderData.shipping_cost === 'number' ? 
      orderData.shipping_cost : 
      0;

    console.log('Shipping cost:', shippingCost);

    // Format shipping lines for Shopify
    const shippingLines = [{
      title: "Standard Shipping",
      price: shippingCost.toFixed(2),
      code: "STANDARD",
      source: "Lovable System"
    }];

    console.log('Shipping lines configuration:', shippingLines);

    // Prepare order payload with timeout
    const orderPayload = {
      order: {
        email: orderData.customer.email,
        send_receipt: true,
        inventory_behaviour: 'decrement_ignoring_policy',
        customer: {
          first_name: orderData.customer.first_name,
          last_name: orderData.customer.last_name,
          email: orderData.customer.email,
          phone: orderData.customer.phone,
        },
        shipping_address: orderData.shipping_address,
        billing_address: orderData.billing_address || orderData.shipping_address,
        line_items: orderData.line_items,
        shipping_lines: shippingLines,
        financial_status: orderData.financial_status,
      },
    };

    console.log('Sending order payload to Shopify:', {
      ...orderPayload,
      order: {
        ...orderPayload.order,
        email: '***@***.com',
        customer: {
          ...orderPayload.order.customer,
          email: '***@***.com'
        }
      }
    });

    // Create order with timeout
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 25000); // 25 second timeout

    try {
      const response = await fetch(
        `https://${SHOPIFY_SHOP_DOMAIN}/admin/api/2024-01/orders.json`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
          },
          body: JSON.stringify(orderPayload),
          signal: controller.signal,
        }
      );

      clearTimeout(timeout);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Shopify API error:', errorData);
        throw new Error(`Shopify API error: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      console.log('Shopify order created successfully:', {
        order_id: data.order.id,
        order_number: data.order.order_number
      });

      return new Response(
        JSON.stringify({ success: true, shopifyOrder: data.order }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    } catch (error) {
      clearTimeout(timeout);
      throw error;
    }
  } catch (error) {
    console.error('Error creating Shopify order:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});