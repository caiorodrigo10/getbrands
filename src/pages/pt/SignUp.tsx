import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "sonner";
import { SignUpFormFields } from "@/components/auth/signup/SignUpFormFields";
import { trackEvent } from "@/lib/analytics";

const SignUpPT = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
  });
  const [errors, setErrors] = useState({
    password: "",
    phone: "",
  });

  const validateForm = () => {
    const newErrors = {
      password: "",
      phone: "",
    };
    let isValid = true;

    if (formData.password.length < 6) {
      newErrors.password = "A senha deve ter pelo menos 6 caracteres";
      isValid = false;
    }

    if (!formData.phone) {
      newErrors.phone = "Número de telefone é obrigatório";
      isValid = false;
    }

    if (!formData.firstName || !formData.lastName || !formData.email) {
      isValid = false;
      toast.error("Por favor, preencha todos os campos");
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            phone: formData.phone,
            role: 'member',
          },
        },
      });

      if (signUpError) {
        if (signUpError.message.includes("User already registered")) {
          toast.error("Este email já está registrado. Por favor, tente fazer login.");
          return;
        }
        throw signUpError;
      }

      if (data?.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: data.user.id,
            first_name: formData.firstName,
            last_name: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            role: 'member',
            language: 'pt',
            updated_at: new Date().toISOString()
          });

        if (profileError) throw profileError;

        // Track signup event in Segment
        if (window.analytics) {
          window.analytics.identify(data.user.id, {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone,
            language: 'pt'
          });

          window.analytics.track('user_signed_up', {
            userId: data.user.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            signupMethod: 'email',
            language: 'pt'
          });
        }

        navigate("/pt/onboarding");
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Falha ao criar conta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-white to-purple-50">
      <div className="w-full max-w-md space-y-8 p-8 bg-white rounded-2xl shadow-lg">
        <div className="flex flex-col items-center space-y-2">
          <img
            src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
            alt="Mainer Logo"
            className="w-[180px] h-auto"
          />
          <h2 className="mt-6 text-2xl font-semibold text-gray-900">
            Crie sua conta
          </h2>
          <p className="text-gray-600">
            Junte-se a nós e comece a construir sua marca
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSignUp}>
          <SignUpFormFields 
            formData={formData}
            errors={errors}
            setFormData={setFormData}
          />

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark text-white py-2.5 rounded-lg transition-all duration-200 font-medium"
            disabled={isLoading}
          >
            {isLoading ? "Criando conta..." : "Criar conta"}
          </Button>

          <div className="text-center text-sm">
            <span className="text-gray-600">Já tem uma conta?</span>{" "}
            <Link to="/login" className="text-primary hover:text-primary-dark font-medium">
              Entrar
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUpPT;