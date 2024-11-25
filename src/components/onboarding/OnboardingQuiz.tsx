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
import { 
  trackOnboardingStarted,
  trackOnboardingStepCompleted,
  trackOnboardingAbandoned,
  trackEvent,
  trackError
} from "@/lib/analytics";

type Step = {
  component: React.ComponentType<any>;
  props: Record<string, any>;
  autoAdvance?: boolean;
  name: string; // Added name for analytics
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

  // Track onboarding start when component mounts
  useState(() => {
    if (user?.id) {
      trackOnboardingStarted(user.id);
    }
  });

  const handleNext = () => {
    // Track step completion
    trackOnboardingStepCompleted(
      currentStep,
      steps[currentStep].name,
      { ...quizData }
    );
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      if (!user?.id) {
        trackError("Onboarding Error", "User not found", "OnboardingQuiz");
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

      // Track onboarding completion
      trackEvent("Onboarding Completed", {
        product_categories: quizData.productCategories,
        profile_type: quizData.profileType,
        brand_status: quizData.brandStatus,
        launch_urgency: quizData.launchUrgency,
        steps_completed: currentStep + 1,
      });

      toast.success("Profile updated successfully!");
      navigate("/start-here");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      trackError("Profile Update Error", error.message, "OnboardingQuiz");
      toast.error(error.message || "Failed to update profile");
    }
  };

  // Track abandonment when user leaves the page
  window.onbeforeunload = () => {
    if (currentStep > 0 && currentStep < steps.length - 1) {
      trackOnboardingAbandoned(currentStep);
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