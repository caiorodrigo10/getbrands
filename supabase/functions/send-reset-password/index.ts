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

    // Generate password reset token
    const { data: { user }, error: resetError } = await supabase.auth.admin.generateLink({
      type: 'recovery',
      email: email,
    });

    if (resetError) throw resetError;
    if (!user) throw new Error("User not found");

    // Get the token from the recovery link
    const token = user.confirmation_sent_at;
    const recoveryToken = Buffer.from(token?.toString() || '').toString('base64');

    // Get user profile
    const { data: profile } = await supabase
      .from("profiles")
      .select("first_name")
      .eq("email", email)
      .single();

    const firstName = profile?.first_name || "User";

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
        subject: "Redefinição de Senha - GetBrands",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Olá ${firstName},</h2>
            <p>Recebemos uma solicitação para redefinir sua senha.</p>
            <p>Clique no botão abaixo para criar uma nova senha:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetLink}?token=${recoveryToken}" 
                 style="background-color: #f0562e; 
                        color: white; 
                        padding: 12px 24px; 
                        text-decoration: none; 
                        border-radius: 4px; 
                        display: inline-block;">
                Redefinir Senha
              </a>
            </div>
            <p>Se você não solicitou esta alteração, por favor ignore este email.</p>
            <p>Este link expira em 24 horas.</p>
            <hr style="margin: 30px 0; border: 1px solid #eee;">
            <p style="color: #666; font-size: 12px;">
              Este é um email automático, por favor não responda.
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