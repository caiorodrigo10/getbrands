import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHOPIFY_API_URL = "https://3qtsxy-nr.myshopify.com/admin/api/2024-10/graphql.json";
const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;
const WEBHOOK_URL = "https://skrvprmnncxpkojraoem.supabase.co/functions/v1/shopify-webhook";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const topics = [
  'ORDERS_CREATE',
  'ORDERS_UPDATED',
  'ORDERS_CANCELLED',
  'ORDERS_FULFILLED',
  'ORDERS_PAID',
  'PRODUCTS_CREATE',
  'PRODUCTS_UPDATE',
  'PRODUCTS_DELETE'
];

async function getExistingWebhooks() {
  const query = `
    query {
      webhookSubscriptions(first: 10) {
        edges {
          node {
            id
            topic
            callbackUrl
          }
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
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const data = await response.json();
  return data.data?.webhookSubscriptions?.edges || [];
}

async function registerWebhook(topic: string, existingWebhooks: any[]) {
  console.log(`Tentando registrar webhook para o tópico: ${topic}`);
  
  // Check if webhook already exists
  const exists = existingWebhooks.some(webhook => 
    webhook.node.topic === topic && webhook.node.callbackUrl === WEBHOOK_URL
  );

  if (exists) {
    console.log(`Webhook já existe para o tópico: ${topic}`);
    return { topic, status: 'already_exists' };
  }
  
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
    console.log(`Resposta do registro de webhook para ${topic}:`, data);

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    if (data.data?.webhookSubscriptionCreate?.userErrors?.length > 0) {
      throw new Error(data.data.webhookSubscriptionCreate.userErrors[0].message);
    }

    return { topic, status: 'created', data };
  } catch (error) {
    console.error(`Erro ao registrar webhook para ${topic}:`, error);
    throw error;
  }
}

serve(async (req) => {
  console.log('Iniciando registro de webhooks');

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify required environment variables
    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_ACCESS_TOKEN não está configurado');
    }

    // Get existing webhooks first
    const existingWebhooks = await getExistingWebhooks();
    console.log('Webhooks existentes:', existingWebhooks);

    const results = [];
    for (const topic of topics) {
      console.log(`Registrando webhook para ${topic}`);
      const result = await registerWebhook(topic, existingWebhooks);
      results.push(result);
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erro ao registrar webhooks:', error);
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