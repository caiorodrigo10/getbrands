import { useState } from "react";
import { WelcomeStepPT } from "./steps/WelcomeStepPT";
import { ProductCategoriesStepPT } from "./steps/ProductCategoriesStepPT";
import { ProfileTypeStepPT } from "./steps/ProfileTypeStepPT";
import { BrandStatusStepPT } from "./steps/BrandStatusStepPT";
import { LaunchUrgencyStepPT } from "./steps/LaunchUrgencyStepPT";
import { SignUpFormStepPT } from "./steps/SignUpFormStepPT";

export const OnboardingQuizPT = () => {
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
      <div className="flex-1 py-12">
        {steps[currentStep].component}
      </div>
    </div>
  );
};