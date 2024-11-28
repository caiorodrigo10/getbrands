import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { handleProductUpdate, handleProductDelete, syncAllProductsCost } from './productHandlers.ts';
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
    // Handle sync costs action
    if (req.method === 'POST') {
      try {
        const body = await req.json();
        logger.info('Received POST request:', { body });
        
        if (body.action === 'sync-costs') {
          logger.info('Starting cost sync');
          const result = await syncAllProductsCost();
          logger.info('Cost sync completed:', result);
          return new Response(
            JSON.stringify(result),
            { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        } else {
          logger.info('Unknown action:', body.action);
        }
      } catch (error) {
        logger.error('Error processing POST request:', error);
        return new Response(
          JSON.stringify({ error: error.message }),
          { 
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400
          }
        );
      }
    }

    const url = new URL(req.url);
    
    // Handle sync all products cost endpoint
    if (url.pathname === '/sync-costs') {
      const result = await syncAllProductsCost();
      return new Response(
        JSON.stringify(result),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    
    logger.debug('Webhook request received', { 
      topic,
      hmacPresent: !!hmac,
      headers: Object.fromEntries(req.headers.entries()),
      timestamp: new Date().toISOString()
    });

    if (!hmac || !topic) {
      logger.error('Missing required headers', { hmac, topic });
      throw new Error('Required Shopify headers missing');
    }

    const rawBody = await req.clone().text();
    
    logger.debug('Webhook payload details', {
      payloadLength: rawBody.length,
      payloadSample: rawBody.substring(0, 100),
      contentType: req.headers.get('content-type'),
      payloadHash: await crypto.subtle.digest('SHA-256', new TextEncoder().encode(rawBody)).then(hash => 
        Array.from(new Uint8Array(hash)).map(b => b.toString(16).padStart(2, '0')).join('')
      )
    });

    const isValid = await validateShopifyHmac(hmac, rawBody, shopifyApiSecret);
    
    if (!isValid) {
      logger.error('Invalid webhook signature', {
        topic,
        receivedHmac: hmac,
        payloadLength: rawBody.length
      });
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

    logger.debug('Webhook processing completed', {
      topic,
      result,
      timestamp: new Date().toISOString()
    });

    return new Response(
      JSON.stringify({ success: true, topic, productId: body.id, result }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    logger.error('Webhook processing failed', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});