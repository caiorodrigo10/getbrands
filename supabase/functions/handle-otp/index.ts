import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from '@supabase/supabase-js'
import { corsHeaders } from '../_shared/cors.ts'

const RATE_LIMIT_WINDOW = 60 * 1000 // 1 minute
const MAX_REQUESTS_PER_WINDOW = 3

const rateLimitMap = new Map<string, number[]>()

const isRateLimited = (email: string): boolean => {
  const now = Date.now()
  const timestamps = rateLimitMap.get(email) || []
  
  // Remove timestamps outside the window
  const recentTimestamps = timestamps.filter(ts => now - ts < RATE_LIMIT_WINDOW)
  
  // Update the timestamps list
  rateLimitMap.set(email, recentTimestamps)
  
  return recentTimestamps.length >= MAX_REQUESTS_PER_WINDOW
}

const addRateLimitTimestamp = (email: string) => {
  const timestamps = rateLimitMap.get(email) || []
  timestamps.push(Date.now())
  rateLimitMap.set(email, timestamps)
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    console.log("[DEBUG] handle-otp - Starting OTP request handling");
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { email, type, persistSession } = await req.json()
    console.log("[DEBUG] handle-otp - Request data:", { email, type, persistSession });

    if (!email) {
      throw new Error('Email is required')
    }

    if (isRateLimited(email)) {
      throw new Error('Too many requests. Please try again later.')
    }

    addRateLimitTimestamp(email)

    if (type !== 'signup' && type !== 'login') {
      throw new Error('Invalid OTP type')
    }

    console.log("[DEBUG] handle-otp - Generating magic link");
    const { data, error } = await supabaseClient.auth.admin.generateLink({
      type: 'magiclink',
      email,
      options: {
        redirectTo: `${req.headers.get('origin')}/auth/callback`,
        ...(persistSession && {
          data: {
            persistSession: true
          }
        })
      }
    })

    if (error) {
      throw error
    }

    console.log("[DEBUG] handle-otp - Magic link generated successfully");
    return new Response(
      JSON.stringify({ message: 'Magic link sent successfully' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )

  } catch (error) {
    console.error('[ERROR] handle-otp - Error handling OTP request:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    )
  }
})