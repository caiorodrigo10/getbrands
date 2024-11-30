import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { trackSignUpEvents } from "@/components/auth/signup/pt/SignUpAnalytics";
import { SignUpForm } from "@/components/auth/signup/pt/SignUpForm";

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

  const handleSignUp = async (formData: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    phone: string;
  }) => {
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

        // Track analytics events in background
        trackSignUpEvents(
          data.user.id,
          {
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            phone: formData.phone
          },
          quizData
        ).catch(console.error); // Handle analytics errors separately

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
    <SignUpForm
      onSubmit={handleSignUp}
      isLoading={isLoading}
      onBack={onBack}
    />
  );
};