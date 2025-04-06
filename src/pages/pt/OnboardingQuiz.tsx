
import { useState } from "react";
import { WelcomeStepPT } from "./steps/WelcomeStepPT";
import { ProductCategoriesStepPT } from "./steps/ProductCategoriesStepPT";
import { ProfileTypeStepPT } from "./steps/ProfileTypeStepPT";
import { BrandStatusStepPT } from "./steps/BrandStatusStepPT";
import { LaunchUrgencyStepPT } from "./steps/LaunchUrgencyStepPT";
import { SignUpFormStepPT } from "./steps/SignUpFormStepPT";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export const OnboardingQuizPT = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
  const navigate = useNavigate();
  const [quizData, setQuizData] = useState({
    productCategories: [] as string[],
    profileType: "",
    brandStatus: "",
    launchUrgency: "",
  });

  const handleNext = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      if (!user?.id) {
        // Se não tiver usuário, continuar para o formulário de inscrição
        return;
      }

      try {
        const { error } = await supabase
          .from("profiles")
          .update({
            product_interest: quizData.productCategories,
            profile_type: quizData.profileType,
            brand_status: quizData.brandStatus,
            launch_urgency: quizData.launchUrgency,
            onboarding_completed: true,
            language: 'pt'
          })
          .eq("id", user.id);

        if (error) {
          console.error("Erro ao atualizar perfil:", error);
          // Não bloquear o fluxo se houver erro
          console.warn("Continuando para a página inicial apesar do erro");
        } else {
          toast.success("Perfil atualizado com sucesso!");
        }
      } catch (updateError) {
        console.error("Exceção durante atualização do perfil:", updateError);
        // Não bloquear o fluxo se houver erro
      }
      
      navigate("/pt/start-here");
    } catch (error: any) {
      console.error("Erro ao completar onboarding:", error);
      toast.error(error.message || "Falha ao completar onboarding");
      // Tentar navegar mesmo assim
      navigate("/pt/start-here");
    }
  };

  const steps = [
    {
      component: <WelcomeStepPT onNext={handleNext} />,
      autoAdvance: true,
    },
    {
      component: (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-6 sm:px-8">
          <ProductCategoriesStepPT
            selected={quizData.productCategories}
            onAnswer={(categories) =>
              setQuizData({ ...quizData, productCategories: categories })
            }
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      ),
      autoAdvance: true,
    },
    {
      component: (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-6 sm:px-8">
          <ProfileTypeStepPT
            selected={quizData.profileType}
            onAnswer={(type) => {
              setQuizData({ ...quizData, profileType: type });
            }}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      ),
      autoAdvance: true,
    },
    {
      component: (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-6 sm:px-8">
          <BrandStatusStepPT
            selected={quizData.brandStatus}
            onAnswer={(status) => {
              setQuizData({ ...quizData, brandStatus: status });
            }}
            onNext={handleNext}
            onBack={handleBack}
          />
        </div>
      ),
      autoAdvance: true,
    },
    {
      component: (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-6 sm:px-8">
          <LaunchUrgencyStepPT
            selected={quizData.launchUrgency}
            onAnswer={(urgency) => {
              setQuizData({ ...quizData, launchUrgency: urgency });
              if (user) {
                handleComplete();
              } else {
                handleNext();
              }
            }}
            onNext={handleNext}
            onBack={handleBack}
            showNextButton={!user}
          />
        </div>
      ),
      autoAdvance: user ? true : false,
    },
    {
      component: (
        <div className="w-full max-w-3xl mx-auto space-y-6 px-6 sm:px-8">
          <SignUpFormStepPT
            onBack={handleBack}
            quizData={quizData}
          />
        </div>
      ),
      autoAdvance: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center py-12">
        {steps[currentStep].component}
      </div>
    </div>
  );
};
