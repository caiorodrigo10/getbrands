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

  const response = await fetch(SHOPIFY_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
    },
    body: JSON.stringify({ query: mutation }),
  });

  return await response.json();
}

serve(async (req) => {
  console.log('Starting webhook registration');

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const results = [];
    for (const topic of topics) {
      console.log(`Registering webhook for ${topic}`);
      const result = await registerWebhook(topic);
      results.push({ topic, result });
      console.log(`Registration result for ${topic}:`, result);
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
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});