import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import { useAuth } from "@/contexts/AuthContext";

type Step = {
  component: React.ComponentType<any>;
  props: Record<string, any>;
};

export function OnboardingQuiz() {
  const navigate = useNavigate();
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

      toast.success("Profile updated successfully!");
      navigate("/dashboard");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const steps: Step[] = [
    {
      component: WelcomeStep,
      props: {
        onNext: handleNext,
      },
    },
    {
      component: ProductCategoriesStep,
      props: {
        selected: quizData.productCategories,
        onAnswer: (value: string[]) => setQuizData({ ...quizData, productCategories: value }),
        onNext: handleNext,
      },
    },
    {
      component: ProfileTypeStep,
      props: {
        selected: quizData.profileType,
        onAnswer: (value: string) => setQuizData({ ...quizData, profileType: value }),
        onNext: handleNext,
      },
    },
    {
      component: BrandStatusStep,
      props: {
        selected: quizData.brandStatus,
        onAnswer: (value: string) => setQuizData({ ...quizData, brandStatus: value }),
        onNext: handleNext,
      },
    },
    {
      component: LaunchUrgencyStep,
      props: {
        selected: quizData.launchUrgency,
        onAnswer: (value: string) => setQuizData({ ...quizData, launchUrgency: value }),
        onComplete: handleComplete,
      },
    },
  ];

  const CurrentStepComponent = steps[currentStep].component;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CurrentStepComponent {...steps[currentStep].props} />
    </div>
  );
}