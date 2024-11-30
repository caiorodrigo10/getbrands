import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeStepPT } from "./steps/WelcomeStepPT";
import { ProductCategoriesStepPT } from "./steps/ProductCategoriesStepPT";
import { ProfileTypeStepPT } from "./steps/ProfileTypeStepPT";
import { BrandStatusStepPT } from "./steps/BrandStatusStepPT";
import { LaunchUrgencyStepPT } from "./steps/LaunchUrgencyStepPT";
import { SignUpFormStepPT } from "./steps/SignUpFormStepPT";
import { trackOnboardingStarted, trackOnboardingStepCompleted } from "@/lib/analytics/onboarding";
import { useEffect } from "react";

export const OnboardingQuizPT = () => {
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [quizData, setQuizData] = useState({
    productCategories: [] as string[],
    profileType: "",
    brandStatus: "",
    launchUrgency: "",
  });

  useEffect(() => {
    if (user?.id) {
      trackOnboardingStarted(user.id, 'pt_onboarding');
    }
  }, [user?.id]);

  const handleNext = () => {
    if (user?.id) {
      trackOnboardingStepCompleted(user.id, `step_${currentStep + 1}`, {
        ...quizData,
        step: currentStep + 1
      }, 'pt_onboarding');
    }
    setCurrentStep((prev) => prev + 1);
  };

  const handleBack = () => {
    setCurrentStep((prev) => prev - 1);
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
              handleNext();
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
              handleNext();
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
              handleNext();
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