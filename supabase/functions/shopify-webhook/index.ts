import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { handleProductUpdate, handleProductDelete } from './productHandlers.ts'

const shopifyApiSecret = "88c1261b203ad4d97aefa71f1d7a3680dee240926b275f56fdbe1862343ba257";
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

async function generateHmacSha256(message: string, key: string): Promise<string> {
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
  return btoa(String.fromCharCode(...new Uint8Array(signature)));
}

serve(async (req) => {
  console.log('Webhook recebido - Iniciando processamento');
  
  if (req.method === 'OPTIONS') {
    console.log('Tratando requisição CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    const shopDomain = req.headers.get('x-shopify-shop-domain');
    
    console.log('Headers do webhook:', {
      hmac,
      topic,
      shopDomain,
      allHeaders: Object.fromEntries(req.headers.entries())
    });
    
    if (!hmac || !topic) {
      console.error('Headers Shopify obrigatórios ausentes:', { hmac, topic });
      throw new Error('Headers Shopify obrigatórios ausentes');
    }

    const rawBody = await req.clone().text();
    console.log('Body do webhook recebido:', rawBody);
    
    // Validação HMAC usando crypto.subtle
    const generatedHash = await generateHmacSha256(rawBody, shopifyApiSecret);

    console.log('Validação HMAC:', {
      received: hmac,
      generated: generatedHash,
      matches: generatedHash === hmac,
      secretUsed: shopifyApiSecret.substring(0, 10) + '...' // Log parcial do secret para debug
    });

    if (generatedHash !== hmac) {
      console.error('Assinatura do webhook inválida', {
        receivedHmac: hmac,
        generatedHmac: generatedHash
      });
      throw new Error('Assinatura do webhook inválida');
    }

    const body = JSON.parse(rawBody);
    console.log('Processando webhook:', { 
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
      console.error('Erro ao registrar webhook:', logError);
    }

    let result;
    switch (topic) {
      case 'products/create':
      case 'products/update':
        console.log('Iniciando atualização do produto:', body.title);
        result = await handleProductUpdate(body);
        console.log('Produto atualizado com sucesso:', result);
        break;
      case 'products/delete':
        console.log('Iniciando exclusão do produto:', body.id);
        result = await handleProductDelete(body);
        console.log('Produto excluído com sucesso');
        break;
      default:
        console.log('Tópico de webhook não tratado:', topic);
    }

    console.log('Webhook processado com sucesso');
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
    console.error('Erro processando webhook:', error);
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