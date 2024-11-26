import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHOPIFY_API_URL = "https://3qtsxy-nr.myshopify.com/admin/api/2024-10/graphql.json";
const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;
const WEBHOOK_URL = "https://skrvprmnncxpkojraoem.supabase.co/functions/v1/shopify-webhook";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const topics = ['PRODUCTS_CREATE', 'PRODUCTS_UPDATE', 'PRODUCTS_DELETE'];

async function registerWebhook(topic: string) {
  console.log(`Attempting to register webhook for topic: ${topic}`);
  
  const mutation = `
    mutation {
      webhookSubscriptionCreate(
        topic: ${topic},
        webhookSubscription: {
          callbackUrl: "${WEBHOOK_URL}",
          format: JSON
        }
      ) {
        userErrors {
          field
          message
        }
        webhookSubscription {
          id
        }
      }
    }
  `;

  try {
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query: mutation }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log(`Webhook registration response for ${topic}:`, data);
    return data;
  } catch (error) {
    console.error(`Error registering webhook for ${topic}:`, error);
    throw error;
  }
}

serve(async (req) => {
  console.log('Starting webhook registration');

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify required environment variables
    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_ACCESS_TOKEN is not configured');
    }

    const results = [];
    for (const topic of topics) {
      console.log(`Registering webhook for ${topic}`);
      const result = await registerWebhook(topic);
      results.push({ topic, result });
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error registering webhooks:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: error instanceof Error ? error.stack : undefined 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});