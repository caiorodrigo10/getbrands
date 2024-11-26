import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleProductUpdate, handleProductDelete } from './productHandlers.ts'

const shopifyApiSecret = "88c1261b203ad4d97aefa71f1d7a3680dee240926b275f56fdbe1862343ba257";
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain',
}

async function generateHmacSha256(message: string, key: string): Promise<string> {
  try {
    console.log('Generating HMAC for message:', message.substring(0, 100) + '...');
    console.log('Using key (first 10 chars):', key.substring(0, 10) + '...');
    
    const encoder = new TextEncoder();
    const keyData = encoder.encode(key);
    const messageData = encoder.encode(message);

    // Import the key
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      {
        name: "HMAC",
        hash: { name: "SHA-256" }
      },
      false,
      ["sign"]
    );

    // Sign the message
    const signature = await crypto.subtle.sign(
      "HMAC",
      cryptoKey,
      messageData
    );

    // Convert to Base64
    const base64Signature = btoa(String.fromCharCode(...new Uint8Array(signature)));
    console.log('Generated base64 signature:', base64Signature);
    
    return base64Signature;
  } catch (error) {
    console.error('Error generating HMAC:', error);
    throw error;
  }
}

serve(async (req) => {
  console.log('Webhook received - Starting processing');
  console.log('Request headers:', Object.fromEntries(req.headers.entries()));
  
  if (req.method === 'OPTIONS') {
    console.log('Handling CORS preflight request');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    
    console.log('Webhook headers:', {
      hmac,
      topic,
      shopDomain,
      allHeaders: Object.fromEntries(req.headers.entries())
    });
    
    if (!hmac || !topic) {
      console.error('Required Shopify headers missing:', { hmac, topic });
      throw new Error('Required Shopify headers missing');
    }

    // Get raw body as string for HMAC validation
    const rawBody = await req.clone().text();
    console.log('Raw webhook body (first 100 chars):', rawBody.substring(0, 100) + '...');
    
    // Validate HMAC using crypto.subtle
    console.log('Starting HMAC validation...');
    const generatedHash = await generateHmacSha256(rawBody, shopifyApiSecret);

    console.log('HMAC Validation Details:', {
      receivedHmac: hmac,
      generatedHmac: generatedHash,
      matches: generatedHash === hmac,
      secretUsed: shopifyApiSecret.substring(0, 10) + '...',
      payloadLength: rawBody.length
    });

    if (generatedHash !== hmac) {
      console.error('HMAC validation failed:', {
        receivedHmac: hmac,
        generatedHmac: generatedHash,
        payloadPreview: rawBody.substring(0, 100) + '...'
      });
      throw new Error('Invalid webhook signature');
    }

    console.log('HMAC validation successful, processing webhook...');
    const body = JSON.parse(rawBody);
    console.log('Processing webhook:', { 
      topic, 
      productId: body.id,
      productTitle: body.title 
    });

    // Initialize Supabase client
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Log the webhook
    const { error: logError } = await supabase
      .from('webhook_logs')
      .insert({
        topic,
        payload: body
      });

    if (logError) {
      console.error('Error logging webhook:', logError);
    }

    let result;
    switch (topic) {
      case 'products/create':
      case 'products/update':
        console.log('Starting product update:', body.title);
        result = await handleProductUpdate(body);
        console.log('Product update successful:', result);
        break;
      case 'products/delete':
        console.log('Starting product deletion:', body.id);
        result = await handleProductDelete(body);
        console.log('Product deletion successful');
        break;
      default:
        console.log('Unhandled webhook topic:', topic);
    }

    console.log('Webhook processed successfully');
    return new Response(JSON.stringify({ 
      success: true,
      topic,
      productId: body.id,
      result 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});