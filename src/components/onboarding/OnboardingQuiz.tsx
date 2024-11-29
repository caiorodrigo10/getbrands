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

type StepProps = {
  selected?: string | string[];
  onAnswer?: (value: any) => void;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
};

type Step = {
  component: React.ComponentType<StepProps>;
  name: string;
  props: StepProps;
  autoAdvance: boolean;
};

// Map translated values to standardized English values for Supabase
const mapProfileType = (value: string): string => {
  const profileTypeMap: Record<string, string> = {
    'criador': 'creator',
    'empreendedor': 'entrepreneur',
    'profissional': 'marketer',
    // Add English values as-is
    'creator': 'creator',
    'entrepreneur': 'entrepreneur',
    'marketer': 'marketer'
  };
  return profileTypeMap[value] || value;
};

const mapBrandStatus = (value: string): string => {
  const brandStatusMap: Record<string, string> = {
    'ideia': 'idea',
    'em_desenvolvimento': 'in_development',
    'pronto_para_lancar': 'ready_to_launch',
    // Add English values as-is
    'idea': 'idea',
    'in_development': 'in_development',
    'ready_to_launch': 'ready_to_launch'
  };
  return brandStatusMap[value] || value;
};

const mapLaunchUrgency = (value: string): string => {
  const urgencyMap: Record<string, string> = {
    'imediato': 'immediate',
    '3_meses': '3_months',
    '6_meses': '6_months',
    // Add English values as-is
    'immediate': 'immediate',
    '3_months': '3_months',
    '6_months': '6_months'
  };
  return urgencyMap[value] || value;
};

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

      // Map values to standardized English before saving to Supabase
      const { error } = await supabase
        .from("profiles")
        .update({
          product_interest: quizData.productCategories,
          profile_type: mapProfileType(quizData.profileType),
          brand_status: mapBrandStatus(quizData.brandStatus),
          launch_urgency: mapLaunchUrgency(quizData.launchUrgency),
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) throw error;

      toast.success("Profile updated successfully!");
      
      // Ensure we have a language prefix
      const currentLang = lang || i18n.language || 'pt';
      navigate(`/${currentLang}/start-here`);
      
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const steps: Step[] = [
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