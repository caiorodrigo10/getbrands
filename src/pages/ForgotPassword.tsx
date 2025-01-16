import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { trackEvent } from "@/lib/analytics";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      // Send custom email via our Edge Function
      const resetLink = `${window.location.origin}/reset-password`;
      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/send-reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          },
          body: JSON.stringify({
            email,
            resetLink,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to send reset email");
      }

      trackEvent("password_reset_requested", {
        email,
      });

      toast.success(
        "Email de recuperação enviado! Verifique sua caixa de entrada."
      );
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(
        error.message || "Erro ao enviar email de recuperação. Tente novamente."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#fafafa]">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
            alt="Logo"
            className="w-[180px] h-auto"
          />
          <h2 className="text-2xl font-bold">Recuperar Senha</h2>
          <p className="text-gray-600 text-center">
            Digite seu email para receber as instruções de recuperação de senha
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#f0562e]/20"
              placeholder="seu@email.com"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-[#f0562e] hover:bg-[#f0562e]/90 text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                <span>Enviando...</span>
              </div>
            ) : (
              "Enviar Email de Recuperação"
            )}
          </Button>

          <div className="text-center">
            <a
              href="/login"
              className="text-[#f0562e] hover:text-[#f0562e]/90 text-sm"
            >
              Voltar para o Login
            </a>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;