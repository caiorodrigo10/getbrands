import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import { useAuth } from "@/contexts/AuthContext";
import { trackOnboardingStarted, trackOnboardingStepCompleted, trackOnboardingCompleted } from "@/lib/analytics/onboarding";

type Step = {
  name: string;
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
    if (user?.id) {
      trackOnboardingStepCompleted(user.id, steps[currentStep].name, quizData);
    }
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

      trackOnboardingCompleted(user.id, {
        product_interest: quizData.productCategories,
        profile_type: quizData.profileType,
        brand_status: quizData.brandStatus,
        launch_urgency: quizData.launchUrgency
      });

      toast.success("Profile updated successfully!");
      navigate("/start-here");
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error.message || "Failed to update profile");
    }
  };

  const steps: Step[] = [
    {
      name: "Welcome",
      component: WelcomeStep,
      props: { onNext: handleNext }
    },
    {
      name: "Product Categories",
      component: ProductCategoriesStep,
      props: {
        selected: quizData.productCategories,
        onAnswer: (categories: string[]) =>
          setQuizData({ ...quizData, productCategories: categories }),
        onNext: handleNext,
        onBack: handleBack
      }
    },
    {
      name: "Profile Type",
      component: ProfileTypeStep,
      props: {
        selected: quizData.profileType,
        onAnswer: (type: string) => {
          setQuizData({ ...quizData, profileType: type });
          handleNext();
        },
        onNext: handleNext,
        onBack: handleBack
      }
    },
    {
      name: "Brand Status",
      component: BrandStatusStep,
      props: {
        selected: quizData.brandStatus,
        onAnswer: (status: string) => {
          setQuizData({ ...quizData, brandStatus: status });
          handleNext();
        },
        onNext: handleNext,
        onBack: handleBack
      }
    },
    {
      name: "Launch Urgency",
      component: LaunchUrgencyStep,
      props: {
        selected: quizData.launchUrgency,
        onAnswer: (urgency: string) => {
          setQuizData({ ...quizData, launchUrgency: urgency });
        },
        onComplete: handleComplete,
        onBack: handleBack
      }
    },
  ];

  useEffect(() => {
    if (user?.id) {
      trackOnboardingStarted(user.id);
    }
  }, [user?.id]);

  const CurrentStep = steps[currentStep].component;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <CurrentStep {...steps[currentStep].props} />
    </div>
  );
}