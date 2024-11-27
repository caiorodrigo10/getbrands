import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const SHOPIFY_API_URL = "https://3qtsxy-nr.myshopify.com/admin/api/2024-10/graphql.json";
const SHOPIFY_ACCESS_TOKEN = Deno.env.get('SHOPIFY_ACCESS_TOKEN')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Iniciando listagem de webhooks');

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify required environment variables
    if (!SHOPIFY_ACCESS_TOKEN) {
      throw new Error('SHOPIFY_ACCESS_TOKEN não está configurado');
    }

    const query = `
      query {
        webhookSubscriptions(first: 10) {
          edges {
            node {
              id
              topic
              callbackUrl
              format
            }
          }
        }
      }
    `;

    console.log('Buscando webhooks do Shopify');
    const response = await fetch(SHOPIFY_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': SHOPIFY_ACCESS_TOKEN,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`Erro HTTP! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('Webhooks recuperados:', data);

    if (data.errors) {
      throw new Error(data.errors[0].message);
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        webhooks: data.data?.webhookSubscriptions?.edges || [] 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Erro ao listar webhooks:', error);
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