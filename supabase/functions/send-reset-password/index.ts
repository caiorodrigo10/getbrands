import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ResetPasswordRequest {
  email: string;
  resetLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, resetLink }: ResetPasswordRequest = await req.json();

    // Validate email
    if (!email) {
      throw new Error("Email is required");
    }

    // Initialize Supabase client with service role key
    const supabase = createClient(
      SUPABASE_URL!,
      SUPABASE_SERVICE_ROLE_KEY!,
    );

    // Check if user exists
    const { data: { users }, error: userError } = await supabase.auth.admin.listUsers({
      filters: {
        email: email
      }
    });

    if (userError) throw userError;
    
    // For security reasons, we return success even if the user doesn't exist
    if (!users || users.length === 0) {
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Generate a token with expiration timestamp (24 hours)
    const timestamp = new Date().getTime() + 24 * 60 * 60 * 1000; // 24 hours from now
    const tokenData = `${timestamp}:${users[0].id}`;
    const encoder = new TextEncoder();
    const token = btoa(String.fromCharCode(...encoder.encode(tokenData)));

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("id", users[0].id)
      .single();

    const firstName = profile?.first_name || "User";

    if (!RESEND_API_KEY) {
      throw new Error("RESEND API key is not configured");
    }

    // Send email via Resend
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "GetBrands <noreply@getbrands.io>",
        to: [email],
        subject: "Password Reset - GetBrands",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Hello ${firstName},</h2>
            <p>We received a request to reset your password.</p>
            <p>Click the button below to create a new password:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}?token=${token}" 
                 style="background-color: #f0562e; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        display: inline-block;">
                Reset Password
              </a>
            </div>
            <p>If you didn't request this change, please ignore this email.</p>
            <p>This link expires in 24 hours.</p>
            <hr style="margin: 30px 0; border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              This is an automated email, please do not reply.
            </p>
          </div>
        `,
      }),
    });

    if (!res.ok) {
      const error = await res.text();
      console.error("Resend API error:", error);
      throw new Error("Failed to send email");
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-reset-password function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
};

serve(handler);