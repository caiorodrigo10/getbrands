import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const shopifyAccessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;
const shopifyApiVersion = '2023-10';
const shopifyShopDomain = Deno.env.get('SHOPIFY_SHOP_DOMAIN')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
  country: "US";
  phone: string;
}

interface OrderData {
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
}

async function createShopifyOrder(orderData: OrderData) {
  const url = `https://${shopifyShopDomain}/admin/api/${shopifyApiVersion}/orders.json`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': shopifyAccessToken,
      },
      body: JSON.stringify({
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
        },
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Shopify API error: ${JSON.stringify(errorData)}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating Shopify order:', error);
    throw error;
  }
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { orderData } = await req.json();

    // Create order in Shopify
    const shopifyResponse = await createShopifyOrder(orderData);

    // Get Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Update our order with Shopify order ID
    if (orderData.orderId) {
      await supabase
        .from('sample_requests')
        .update({ 
          shopify_order_id: shopifyResponse.order.id,
          status: 'processing'
        })
        .eq('id', orderData.orderId);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        shopifyOrder: shopifyResponse.order 
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        } 
      }
    );

  } catch (error) {
    console.error('Error in shopify-create-order function:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json'
        },
        status: 400
      }
    );
  }
});