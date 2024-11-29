import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeStepPT } from "./steps/WelcomeStepPT";
import { ProductCategoriesStepPT } from "./steps/ProductCategoriesStepPT";
import { ProfileTypeStepPT } from "./steps/ProfileTypeStepPT";
import { BrandStatusStepPT } from "./steps/BrandStatusStepPT";
import { LaunchUrgencyStepPT } from "./steps/LaunchUrgencyStepPT";
import { SignUpFormStepPT } from "./steps/SignUpFormStepPT";
import { useAuth } from "@/contexts/AuthContext";

type Step = {
  component: React.ComponentType<any>;
  props?: Record<string, any>;
  autoAdvance?: boolean;
  name: string;
};

export function OnboardingQuizPT() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
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
    if (!isPublicFlow) {
      try {
        if (!user?.id) {
          toast.error("Usuário não encontrado");
          return;
        }

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

        if (error) throw error;

        toast.success("Perfil atualizado com sucesso!");
        navigate("/catalog");
      } catch (error: any) {
        console.error("Erro ao atualizar perfil:", error);
        toast.error(error.message || "Falha ao atualizar perfil");
      }
    } else {
      handleNext();
    }
  };

  const isPublicFlow = location.pathname === "/comecarpt";

  const baseSteps: Step[] = [
    {
      component: WelcomeStepPT,
      name: "Bem-vindo",
      props: {
        onNext: handleNext,
      },
      autoAdvance: true,
    },
    {
      component: ProductCategoriesStepPT,
      name: "Categorias de Produtos",
      props: {
        selected: quizData.productCategories,
        onAnswer: (value: string[]) => {
          setQuizData({ ...quizData, productCategories: value });
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: false,
    },
    {
      component: ProfileTypeStepPT,
      name: "Tipo de Perfil",
      props: {
        selected: quizData.profileType,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, profileType: value });
          if (baseSteps[2].autoAdvance) handleNext();
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: true,
    },
    {
      component: BrandStatusStepPT,
      name: "Status da Marca",
      props: {
        selected: quizData.brandStatus,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, brandStatus: value });
          if (baseSteps[3].autoAdvance) handleNext();
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: true,
    },
    {
      component: LaunchUrgencyStepPT,
      name: "Urgência de Lançamento",
      props: {
        selected: quizData.launchUrgency,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, launchUrgency: value });
        },
        onNext: isPublicFlow ? handleNext : handleComplete,
        onBack: handleBack,
        showNextButton: isPublicFlow,
      },
      autoAdvance: false,
    },
  ];

  const steps = isPublicFlow
    ? [
        ...baseSteps,
        {
          component: SignUpFormStepPT,
          name: "Cadastro",
          props: {
            onBack: handleBack,
            quizData: quizData,
          },
        },
      ]
    : baseSteps;

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CurrentStepComponent {...(steps[currentStep].props || {})} />
    </div>
  );
}

export default OnboardingQuizPT;