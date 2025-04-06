
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
import { trackOnboardingCompleted } from "@/lib/analytics/onboarding";

type Step = {
  component: React.ComponentType<any>;
  props: Record<string, any>;
  autoAdvance?: boolean;
  name: string;
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

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleComplete = async () => {
    try {
      if (!user?.id) {
        toast.error("User not found");
        return;
      }

      // Update both database profile and user metadata for consistency
      try {
        // 1. Update database profile first
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            product_interest: quizData.productCategories,
            profile_type: quizData.profileType,
            brand_status: quizData.brandStatus,
            launch_urgency: quizData.launchUrgency,
            onboarding_completed: true,
            updated_at: new Date().toISOString()
          })
          .eq("id", user.id);

        if (profileError) {
          console.error("Error updating profile:", profileError);
          toast.error("Failed to update profile");
        } else {
          // 2. Update user metadata to match profile
          const { error: metadataError } = await supabase.auth.updateUser({
            data: { 
              onboarding_completed: true,
              profile_type: quizData.profileType,
              brand_status: quizData.brandStatus,
              launch_urgency: quizData.launchUrgency
            }
          });
          
          if (metadataError) {
            console.error("Error updating user metadata:", metadataError);
          }
          
          // Track completion event in analytics
          if (user.id) {
            try {
              trackOnboardingCompleted(user.id, {
                profile_type: quizData.profileType,
                product_interest: quizData.productCategories,
                brand_status: quizData.brandStatus
              });
            } catch (analyticsError) {
              console.error("Error tracking onboarding completion:", analyticsError);
            }
          }
          
          toast.success("Profile updated successfully!");
        }
      } catch (updateError) {
        console.error("Exception during profile update:", updateError);
      }
      
      // Always navigate to the next page, even if there was an error
      navigate("/start-here");
    } catch (error: any) {
      console.error("Error in handleComplete:", error);
      toast.error(error.message || "Failed to complete onboarding");
      // Try to navigate anyway
      navigate("/start-here");
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
