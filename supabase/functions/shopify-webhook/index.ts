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
    
    if (!hmac || !topic) {
      logger.error('Missing required headers', { hmac, topic });
      throw new Error('Required Shopify headers missing');
    }

    const rawBody = await req.clone().text();
    const isValid = await validateShopifyHmac(hmac, rawBody, shopifyApiSecret);
    
    if (!isValid) {
      logger.error('Invalid HMAC signature', { hmac });
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
        logger.info('Unhandled webhook topic', { topic });
    }

    return new Response(
      JSON.stringify({ success: true, topic, productId: body.id, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    logger.error('Webhook processing failed', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});