import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { stripe } from "../_shared/stripe.ts"
import { corsHeaders } from "../_shared/cors.ts"

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { amount, currency = 'brl', shipping_amount } = await req.json()

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      shipping: shipping_amount ? {
        name: 'Frete padrão',
        address: {
          line1: "Endereço de entrega",
          city: "Cidade",
          state: "Estado",
          postal_code: "00000-000",
          country: 'BR',
        },
      } : undefined,
    })

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})