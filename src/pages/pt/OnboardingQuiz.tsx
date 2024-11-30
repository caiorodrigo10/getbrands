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
        <ProductCategoriesStepPT
          selected={quizData.productCategories}
          onAnswer={(categories) =>
            setQuizData({ ...quizData, productCategories: categories })
          }
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
      autoAdvance: true,
    },
    {
      component: (
        <ProfileTypeStepPT
          selected={quizData.profileType}
          onAnswer={(type) => {
            setQuizData({ ...quizData, profileType: type });
            handleNext();
          }}
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
      autoAdvance: true,
    },
    {
      component: (
        <BrandStatusStepPT
          selected={quizData.brandStatus}
          onAnswer={(status) => {
            setQuizData({ ...quizData, brandStatus: status });
            handleNext();
          }}
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
      autoAdvance: true,
    },
    {
      component: (
        <LaunchUrgencyStepPT
          selected={quizData.launchUrgency}
          onAnswer={(urgency) => {
            setQuizData({ ...quizData, launchUrgency: urgency });
            handleNext();
          }}
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
      autoAdvance: true,
    },
    {
      component: (
        <SignUpFormStepPT
          onBack={handleBack}
          quizData={quizData}
        />
      ),
      autoAdvance: false,
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="py-8">
        {steps[currentStep].component}
      </div>
    </div>
  );
};
