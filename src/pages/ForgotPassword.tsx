import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Mail, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // First, check if user exists
      const { data: existingUser, error: userError } = await supabase.auth.resetPasswordForEmail(
        email,
        {
          redirectTo: `${window.location.origin}/reset-password`,
        }
      );

      if (userError) throw userError;

      // Call our edge function to send the custom email
      const { error: emailError } = await supabase.functions.invoke("send-reset-password", {
        body: {
          email,
          resetLink: `${window.location.origin}/reset-password`,
        },
      });

      if (emailError) throw emailError;

      toast.success("Se uma conta existir com este email, você receberá instruções para redefinir sua senha.");
      
    } catch (error: any) {
      console.error("Error resetting password:", error);
      toast.error("Falha ao enviar instruções. Por favor, tente novamente.");
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
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Redefinir sua senha
          </h2>
          <p className="text-gray-600">
            Digite seu email para receber instruções
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
                <span>Enviando instruções...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Mail className="mr-2 h-4 w-4" />
                <span>Enviar instruções</span>
              </div>
            )}
          </Button>
        </form>

        <div className="mt-4 text-center text-sm">
          <Link 
            to="/login" 
            className="text-[#f0562e] hover:text-[#f0562e]/90 inline-flex items-center"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;