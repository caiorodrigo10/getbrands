import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const shopifyApiKey = Deno.env.get('SHOPIFY_API_KEY')!;
const shopifyApiSecret = Deno.env.get('SHOPIFY_API_SECRET')!;
const shopifyAccessToken = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    
    if (!hmac || !topic) {
      throw new Error('Missing required Shopify headers');
    }

    const body = await req.json();
    console.log('Received Shopify webhook:', { topic, body });

    switch (topic) {
      case 'products/create':
      case 'products/update':
        await handleProductUpdate(body);
        break;
      case 'products/delete':
        await handleProductDelete(body);
        break;
      default:
        console.log('Unhandled webhook topic:', topic);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});

async function handleProductUpdate(shopifyProduct: any) {
  const variant = shopifyProduct.variants[0]; // Get first variant
  const images = shopifyProduct.images.map((img: any) => ({
    image_url: img.src,
    position: img.position,
    is_primary: img.position === 1
  }));

  // First, create or update the product
  const { data: product, error: productError } = await supabase
    .from('products')
    .upsert({
      name: shopifyProduct.title,
      description: shopifyProduct.body_html,
      category: shopifyProduct.product_type || 'Uncategorized',
      from_price: parseFloat(variant.price),
      srp: parseFloat(variant.compare_at_price || variant.price),
      image_url: shopifyProduct.images[0]?.src,
      is_new: shopifyProduct.tags.includes('new'),
      updated_at: new Date().toISOString()
    })
    .select()
    .single();

  if (productError) throw productError;

  // Then, update the shopify_products mapping table
  const { error: mappingError } = await supabase
    .from('shopify_products')
    .upsert({
      product_id: product.id,
      shopify_id: shopifyProduct.id.toString(),
      shopify_variant_id: variant.id.toString(),
      last_synced_at: new Date().toISOString()
    });

  if (mappingError) throw mappingError;

  // Finally, update product images
  if (images.length > 0) {
    const { error: imagesError } = await supabase
      .from('product_images')
      .upsert(
        images.map(img => ({
          product_id: product.id,
          ...img
        }))
      );

    if (imagesError) throw imagesError;
  }
}

async function handleProductDelete(shopifyProduct: any) {
  const { error } = await supabase
    .from('shopify_products')
    .delete()
    .eq('shopify_id', shopifyProduct.id.toString());

  if (error) throw error;
}