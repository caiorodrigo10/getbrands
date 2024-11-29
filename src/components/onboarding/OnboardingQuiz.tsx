import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import { useAuth } from "@/contexts/AuthContext";
import { useTranslation } from "react-i18next";

export function OnboardingQuiz() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { lang } = useParams();
  const { i18n } = useTranslation();
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
    try {
      if (!user?.id) {
        toast.error("User not found");
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
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Perfil atualizado com sucesso!");
      navigate(`/${lang || i18n.language}/start-here`);
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Falha ao atualizar perfil");
    }
  };

  const steps = [
    {
      component: WelcomeStep,
      name: "Welcome",
      props: {
        onNext: handleNext,
      },
      autoAdvance: true,
    },
    {
      component: ProductCategoriesStep,
      name: "Product Categories",
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
      component: ProfileTypeStep,
      name: "Profile Type",
      props: {
        selected: quizData.profileType,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, profileType: value });
          if (steps[2].autoAdvance) handleNext();
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: true,
    },
    {
      component: BrandStatusStep,
      name: "Brand Status",
      props: {
        selected: quizData.brandStatus,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, brandStatus: value });
          if (steps[3].autoAdvance) handleNext();
        },
        onNext: handleNext,
        onBack: handleBack,
      },
      autoAdvance: true,
    },
    {
      component: LaunchUrgencyStep,
      name: "Launch Urgency",
      props: {
        selected: quizData.launchUrgency,
        onAnswer: (value: string) => {
          setQuizData({ ...quizData, launchUrgency: value });
        },
        onComplete: handleComplete,
        onBack: handleBack,
      },
      autoAdvance: false,
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CurrentStepComponent {...steps[currentStep].props} />
    </div>
  );
}