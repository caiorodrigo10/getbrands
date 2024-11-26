import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleProductUpdate, handleProductDelete } from './productHandlers.ts';
import { validateShopifyHmac } from './hmacValidation.ts';
import { logger } from './logger.ts';

const shopifyApiSecret = Deno.env.get('SHOPIFY_API_SECRET')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-shopify-hmac-sha256, x-shopify-topic, x-shopify-shop-domain',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    
    logger.info('V2: Received webhook request', { 
      topic,
      hmacPresent: !!hmac,
      headers: Object.fromEntries(req.headers.entries())
    });

    if (!hmac || !topic) {
      logger.error('V2: Missing required headers', { hmac, topic });
      throw new Error('Required Shopify headers missing');
    }

    const rawBody = await req.clone().text();
    
    logger.info('V2: Webhook payload received', {
      payloadLength: rawBody.length,
      payloadSample: rawBody.substring(0, 100)
    });

    const isValid = await validateShopifyHmac(hmac, rawBody, shopifyApiSecret);
    
    if (!isValid) {
      throw new Error('Invalid webhook signature');
    }

    const body = JSON.parse(rawBody);
    logger.webhook(topic, 'received', { id: body.id });

    let result;
    switch (topic) {
      case 'products/create':
      case 'products/update':
        result = await handleProductUpdate(body);
        break;
      case 'products/delete':
        result = await handleProductDelete(body);
        break;
      default:
        logger.info('V2: Unhandled webhook topic', { topic });
    }

    return new Response(
      JSON.stringify({ success: true, topic, productId: body.id, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    logger.error('V2: Webhook processing failed', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});