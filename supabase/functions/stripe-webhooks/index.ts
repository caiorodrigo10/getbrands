
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
        // Get the order details including user_id
        const { data: orderData, error: orderError } = await supabaseAdmin
          .from('sample_requests')
          .select('id, status, user_id')
          .eq('id', orderId)
          .single();

        if (orderError) {
          console.error("Error fetching order details:", orderError);
          return new Response(JSON.stringify({ error: "Error fetching order details" }), { 
            status: 500,
            headers: { ...corsHeaders, "Content-Type": "application/json" }
          });
        }

        // Update order status to processing
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

        // If the user has made a purchase, update their role to 'customer' if they're not already an admin
        if (orderData && orderData.user_id) {
          const userId = orderData.user_id;
          
          // Check current role
          const { data: profileData, error: profileError } = await supabaseAdmin
            .from('profiles')
            .select('id, role')
            .eq('id', userId)
            .single();

          if (profileError) {
            console.error("Error fetching user profile:", profileError);
          } else if (profileData && profileData.role !== 'admin') {
            // Only update if user is not an admin
            const { error: updateError } = await supabaseAdmin
              .from('profiles')
              .update({ role: 'customer' })
              .eq('id', userId);

            if (updateError) {
              console.error("Error updating user role to customer:", updateError);
            } else {
              console.log(`Updated user ${userId} role to customer`);
            }
          }
        }
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
