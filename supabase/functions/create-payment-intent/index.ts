import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import Stripe from "https://esm.sh/stripe@12.4.0?target=deno"

const stripe = new Stripe(Deno.env.get('NEW_STRIPE_SECRET_KEY') as string, {
  apiVersion: '2023-10-16',
  httpClient: Stripe.createFetchHttpClient(),
});

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const MINIMUM_CHARGE_AMOUNT = 50; // 50 cents minimum

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { amount, currency = 'usd', shipping_amount, items, subtotal, total, discountAmount, metadata } = await req.json();

    console.log('Creating payment intent with:', { 
      amount, 
      currency, 
      shipping_amount, 
      subtotal, 
      total, 
      discountAmount, 
      metadata 
    });

    // Calculate final amount after discount
    let finalAmount = Math.max(Math.round((amount - (discountAmount || 0)) * 100), MINIMUM_CHARGE_AMOUNT);

    // If the amount would be less than minimum, adjust discount to maintain minimum charge
    if (finalAmount < MINIMUM_CHARGE_AMOUNT) {
      const maxAllowableDiscount = amount * 100 - MINIMUM_CHARGE_AMOUNT;
      finalAmount = MINIMUM_CHARGE_AMOUNT;
      console.log(`Adjusted discount to maintain minimum charge. Original discount: ${discountAmount}, Max allowable: ${maxAllowableDiscount/100}`);
    }

    console.log('Payment calculation:', {
      originalAmount: amount,
      discountAmount: discountAmount || 0,
      finalAmountInCents: finalAmount,
      minimumCharge: MINIMUM_CHARGE_AMOUNT
    });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: finalAmount,
      currency,
      automatic_payment_methods: {
        enabled: true,
      },
      metadata: {
        shipping_amount: shipping_amount || 0,
        subtotal: subtotal || 0,
        discount_amount: discountAmount || 0,
        original_amount: metadata?.original_amount || 0,
        final_amount: finalAmount / 100, // Store the actual charged amount
      }
    });

    console.log('Payment intent created:', {
      id: paymentIntent.id,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      metadata: paymentIntent.metadata
    });

    return new Response(
      JSON.stringify({ clientSecret: paymentIntent.client_secret }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    );
  } catch (error) {
    console.error('Error creating payment intent:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    );
  }
});