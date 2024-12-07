import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { Analytics } from 'https://esm.sh/@segment/analytics-node@1.1.3'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const analytics = new Analytics({ writeKey: Deno.env.get('SEGMENT_WRITE_KEY') || '' })

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[DEBUG] handle-otp - Starting OTP request handling");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, type } = await req.json()
    console.log("[DEBUG] handle-otp - Request data:", { email, type });

    if (!email) {
      throw new Error('Email is required')
    }

    // Check rate limiting
    const { data: attempts } = await supabaseClient
      .from('otp_attempts')
      .select('*')
      .eq('email', email)
      .single()

    console.log("[DEBUG] handle-otp - Previous attempts:", attempts);

    if (attempts) {
      const timeSinceLastAttempt = Date.now() - new Date(attempts.last_attempt).getTime()
      if (timeSinceLastAttempt < 60000 && attempts.attempt_count >= 3) {
        console.log("[DEBUG] handle-otp - Rate limit exceeded for email:", email);
        throw new Error('Too many attempts. Please try again later.')
      }
    }

    // Generate OTP code (6 digits)
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString()
    console.log("[DEBUG] handle-otp - Generated OTP code:", otpCode);
    
    // Track OTP requested event in Segment
    console.log("[DEBUG] handle-otp - Tracking otp_requested event");
    analytics.track({
      userId: email,
      event: 'otp_requested',
      properties: {
        email,
        type: type === 'signup' ? 'signup' : 'login',
        otpCode: otpCode,
        timestamp: new Date().toISOString()
      }
    })

    // Send magic link via Supabase Auth
    console.log("[DEBUG] handle-otp - Generating magic link");
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${req.headers.get('origin')}/auth/callback`
      }
    })

    if (error) {
      console.error("[ERROR] handle-otp - Failed to generate magic link:", error);
      throw error;
    }

    // Update rate limiting
    await supabaseClient.from('otp_attempts')
      .upsert({
        email,
        attempt_count: attempts ? attempts.attempt_count + 1 : 1,
        last_attempt: new Date().toISOString()
      })

    console.log(`[DEBUG] handle-otp - OTP process completed successfully for ${email}`);

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('[ERROR] handle-otp - Error handling OTP request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})