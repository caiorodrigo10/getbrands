import { useState, useEffect } from "react";
import { WelcomeStepPT } from "./steps/WelcomeStepPT";
import { ProductCategoriesStepPT } from "./steps/ProductCategoriesStepPT";
import { ProfileTypeStepPT } from "./steps/ProfileTypeStepPT";
import { BrandStatusStepPT } from "./steps/BrandStatusStepPT";
import { LaunchUrgencyStepPT } from "./steps/LaunchUrgencyStepPT";
import { SignUpFormStepPT } from "./steps/SignUpFormStepPT";
import { useAuth } from "@/contexts/AuthContext";
import { trackOnboardingStarted, trackOnboardingStepCompleted } from "@/lib/analytics/onboarding";

export const OnboardingQuizPT = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const { user } = useAuth();
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

  // Track onboarding start when component mounts
  useEffect(() => {
    if (user?.id) {
      trackOnboardingStarted(user.id);
    }
  }, [user?.id]);

  const steps = [
    {
      component: <WelcomeStepPT onNext={handleNext} />,
      autoAdvance: true,
      name: "Welcome"
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
      name: "Product Categories"
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
