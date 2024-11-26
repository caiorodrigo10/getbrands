import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const shopifyApiSecret = Deno.env.get('SHOPIFY_API_SECRET')!;

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
      console.error('Missing required Shopify headers:', { hmac, topic });
      throw new Error('Missing required Shopify headers');
    }

    // Get raw body for HMAC validation
    const rawBody = await req.clone().text();
    
    // Validate webhook signature
    const generatedHash = createHmac("sha256", shopifyApiSecret)
      .update(rawBody)
      .toString("base64");

    if (generatedHash !== hmac) {
      console.error('Invalid webhook signature');
      throw new Error('Invalid webhook signature');
    }

    // Parse body as JSON after validation
    const body = JSON.parse(rawBody);
    console.log('Received Shopify webhook:', { topic, productId: body.id });

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
  try {
    console.log('Processing product update:', { 
      productId: shopifyProduct.id,
      title: shopifyProduct.title 
    });

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

    if (productError) {
      console.error('Error upserting product:', productError);
      throw productError;
    }

    console.log('Product upserted successfully:', { productId: product.id });

    // Then, update the shopify_products mapping table
    const { error: mappingError } = await supabase
      .from('shopify_products')
      .upsert({
        product_id: product.id,
        shopify_id: shopifyProduct.id.toString(),
        shopify_variant_id: variant.id.toString(),
        last_synced_at: new Date().toISOString()
      });

    if (mappingError) {
      console.error('Error updating product mapping:', mappingError);
      throw mappingError;
    }

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

      if (imagesError) {
        console.error('Error updating product images:', imagesError);
        throw imagesError;
      }
      
      console.log('Product images updated successfully:', { 
        productId: product.id,
        imageCount: images.length 
      });
    }
  } catch (error) {
    console.error('Error in handleProductUpdate:', error);
    throw error;
  }
}

async function handleProductDelete(shopifyProduct: any) {
  try {
    console.log('Processing product deletion:', { productId: shopifyProduct.id });

    // First get the product mapping
    const { data: mapping, error: fetchError } = await supabase
      .from('shopify_products')
      .select('product_id')
      .eq('shopify_id', shopifyProduct.id.toString())
      .single();

    if (fetchError) {
      console.error('Error fetching product mapping:', fetchError);
      throw fetchError;
    }

    if (mapping) {
      // Delete product images
      const { error: imagesError } = await supabase
        .from('product_images')
        .delete()
        .eq('product_id', mapping.product_id);

      if (imagesError) {
        console.error('Error deleting product images:', imagesError);
        throw imagesError;
      }

      // Delete the product
      const { error: productError } = await supabase
        .from('products')
        .delete()
        .eq('id', mapping.product_id);

      if (productError) {
        console.error('Error deleting product:', productError);
        throw productError;
      }

      // Delete the mapping
      const { error: mappingError } = await supabase
        .from('shopify_products')
        .delete()
        .eq('shopify_id', shopifyProduct.id.toString());

      if (mappingError) {
        console.error('Error deleting product mapping:', mappingError);
        throw mappingError;
      }

      console.log('Product and related data deleted successfully:', { 
        shopifyId: shopifyProduct.id,
        productId: mapping.product_id 
      });
    }
  } catch (error) {
    console.error('Error in handleProductDelete:', error);
    throw error;
  }
}