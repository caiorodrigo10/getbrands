import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createHmac } from "https://deno.land/std@0.168.0/crypto/mod.ts";
import { handleProductUpdate, handleProductDelete } from './productHandlers.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const shopifyApiSecret = Deno.env.get('SHOPIFY_API_SECRET')!;
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  console.log('Webhook recebido');
  
  if (req.method === 'OPTIONS') {
    console.log('Tratando requisição CORS preflight');
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const hmac = req.headers.get('x-shopify-hmac-sha256');
    const topic = req.headers.get('x-shopify-topic');
    
    console.log('Headers do webhook:', {
      hmac,
      topic,
      allHeaders: Object.fromEntries(req.headers.entries())
    });
    
    if (!hmac || !topic) {
      console.error('Headers Shopify obrigatórios ausentes:', { hmac, topic });
      throw new Error('Headers Shopify obrigatórios ausentes');
    }

    const rawBody = await req.clone().text();
    console.log('Body do webhook recebido:', rawBody);
    
    const generatedHash = createHmac("sha256", shopifyApiSecret)
      .update(rawBody)
      .toString("base64");

    console.log('Validação HMAC:', {
      received: hmac,
      generated: generatedHash,
      matches: generatedHash === hmac
    });

    if (generatedHash !== hmac) {
      console.error('Assinatura do webhook inválida');
      throw new Error('Assinatura do webhook inválida');
    }

    const body = JSON.parse(rawBody);
    console.log('Processando webhook:', { topic, productId: body.id });

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

    switch (topic) {
      case 'products/create':
      case 'products/update':
        await handleProductUpdate(body);
        break;
      case 'products/delete':
        await handleProductDelete(body);
        break;
      default:
        console.log('Tópico de webhook não tratado:', topic);
    }

    console.log('Webhook processado com sucesso');
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Erro processando webhook:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    );
  }
});