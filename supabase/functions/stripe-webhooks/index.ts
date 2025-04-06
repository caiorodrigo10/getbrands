import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { stripe } from "../_shared/stripe.ts";
import { supabaseAdmin } from "../../src/lib/supabase/admin.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Get the Stripe signing secret from environment variables
const endpointSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    let event;
    const signature = req.headers.get("stripe-signature");

    console.log("Received Stripe webhook event");

    // Verify the signature if we have a signing secret
    if (endpointSecret && signature) {
      try {
        event = stripe.webhooks.constructEvent(
          body,
          signature,
          endpointSecret
        );
      } catch (err) {
        console.error("⚠️  Webhook signature verification failed.", err.message);
        return new Response(JSON.stringify({ error: "Webhook signature verification failed" }), { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    } else {
      // If no signing secret, just parse the event
      try {
        event = JSON.parse(body);
      } catch (err) {
        console.error("Error parsing webhook body", err);
        return new Response(JSON.stringify({ error: "Invalid request body" }), { 
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" }
        });
      }
    }

    console.log(`Processing event type: ${event.type}`);
    
    // Handle payment_intent.succeeded event
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      console.log("Payment succeeded:", paymentIntent.id);

      // Extract metadata which should contain our order ID
      const { orderId } = paymentIntent.metadata || {};

      // If orderId is present, update the order status to 'processing'
      if (orderId) {
        console.log(`Updating order ${orderId} to processing status`);
        const { data, error } = await supabaseAdmin
          .from('sample_requests')
          .update({ status: 'processing' })
          .eq('id', orderId)
          .select('id, status');

        if (error) {
          console.error("Error updating order status:", error);
          return new Response(JSON.stringify({ error: "Error updating order status" }), { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        console.log("Order updated successfully:", data);
      } else {
        console.log("No orderId found in payment intent metadata");
      }
    }

    // Handle payment failure events (optional)
    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;
      console.log("Payment failed:", paymentIntent.id);
      
      const { orderId } = paymentIntent.metadata || {};
      if (orderId) {
        console.log(`Marking order ${orderId} as failed`);
        // We could update the status to 'failed' or similar here
        // For now, we'll keep it as pending since it might be retried
      }
    }

    // Return a successful response
    return new Response(JSON.stringify({ received: true }), { 
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });

  } catch (err) {
    console.error("Error processing webhook:", err);
    return new Response(JSON.stringify({ error: "Server error" }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" }
    });
  }
});
