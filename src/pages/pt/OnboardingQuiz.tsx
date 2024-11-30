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
    },
    {
      component: (
        <ProfileTypeStepPT
          selected={quizData.profileType}
          onAnswer={(type) => setQuizData({ ...quizData, profileType: type })}
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
    },
    {
      component: (
        <BrandStatusStepPT
          selected={quizData.brandStatus}
          onAnswer={(status) => setQuizData({ ...quizData, brandStatus: status })}
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
    },
    {
      component: (
        <LaunchUrgencyStepPT
          selected={quizData.launchUrgency}
          onAnswer={(urgency) =>
            setQuizData({ ...quizData, launchUrgency: urgency })
          }
          onNext={handleNext}
          onBack={handleBack}
        />
      ),
    },
    {
      component: (
        <SignUpFormStepPT
          onBack={handleBack}
          quizData={quizData}
        />
      ),
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