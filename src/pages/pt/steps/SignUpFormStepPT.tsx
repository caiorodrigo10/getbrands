import { useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { SignUpFormFields } from "@/components/auth/signup/SignUpFormFields";
import { trackEvent } from "@/lib/analytics";

export interface SignUpFormStepPTProps {
  onBack: () => void;
  quizData: {
    productCategories: string[];
    profileType: string;
    brandStatus: string;
    launchUrgency: string;
  };
}

export const SignUpFormStepPT = ({ onBack, quizData }: SignUpFormStepPTProps) => {
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
          toast.error("Este email já está cadastrado. Por favor, faça login.");
          setIsLoading(false);
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
            product_interest: quizData.productCategories,
            profile_type: quizData.profileType,
            brand_status: quizData.brandStatus,
            launch_urgency: quizData.launchUrgency,
            onboarding_completed: true,
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
            language: 'pt',
            product_interest: quizData.productCategories,
            profile_type: quizData.profileType,
            brand_status: quizData.brandStatus,
            launch_urgency: quizData.launchUrgency
          });

          window.analytics.track('user_signed_up', {
            userId: data.user.id,
            email: formData.email,
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            signupMethod: 'email',
            language: 'pt',
            product_interest: quizData.productCategories,
            profile_type: quizData.profileType,
            brand_status: quizData.brandStatus,
            launch_urgency: quizData.launchUrgency,
            onboarding_completed: true
          });
        }

        window.location.href = "/pt/start-here";
      }
    } catch (error: any) {
      console.error("Erro ao criar conta:", error);
      toast.error(error.message || "Falha ao criar conta. Por favor, tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center space-y-3">
        <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2">
          Estamos Quase Lá!
        </h2>
        <p className="text-lg text-gray-600 max-w-xl mx-auto">
          Preencha seus dados abaixo para desbloquear acesso ao nosso catálogo completo de produtos
        </p>
      </div>

      <form className="space-y-6" onSubmit={handleSignUp}>
        <SignUpFormFields 
          formData={formData}
          errors={errors}
          setFormData={setFormData}
        />

        <div className="flex flex-col items-center space-y-4">
          <Button
            type="submit"
            className="w-auto px-6"
            disabled={isLoading}
          >
            {isLoading ? "Criando..." : "Acessar Catálogo de Produtos"}
          </Button>
          
          <button
            type="button"
            onClick={onBack}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Voltar
          </button>
        </div>
      </form>
    </div>
  );
};