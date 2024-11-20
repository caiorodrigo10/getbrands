import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import { PhoneNumberStep } from "./steps/PhoneNumberStep";
import { useOnboardingQuiz } from "./hooks/useOnboardingQuiz";

export type QuizStep = {
  id: number;
  component: React.ReactNode;
  isMultiSelect?: boolean;
  isRequired?: boolean;
};

export const OnboardingQuiz = () => {
  const {
    currentStep,
    answers,
    handleNext,
    handleBack,
    handleAnswer,
    handleComplete
  } = useOnboardingQuiz();

  const steps: QuizStep[] = [
    { 
      id: 1, 
      component: <WelcomeStep onNext={() => handleNext(steps)} />,
      isRequired: false
    },
    { 
      id: 2, 
      component: <ProductCategoriesStep 
        selected={answers.categories || []}
        onAnswer={(value) => handleAnswer('categories', value, steps)}
        onNext={() => handleNext(steps)}
      />,
      isMultiSelect: true,
      isRequired: true
    },
    { 
      id: 3, 
      component: <ProfileTypeStep 
        selected={answers.profileType}
        onAnswer={(value) => handleAnswer('profileType', value, steps)}
        onNext={() => handleNext(steps)}
      />,
      isRequired: true
    },
    { 
      id: 4, 
      component: <BrandStatusStep 
        selected={answers.brandStatus}
        onAnswer={(value) => handleAnswer('brandStatus', value, steps)}
        onNext={() => handleNext(steps)}
      />,
      isRequired: true
    },
    { 
      id: 5, 
      component: <LaunchUrgencyStep 
        selected={answers.launchUrgency}
        onAnswer={(value) => handleAnswer('launchUrgency', value, steps)}
        onNext={() => handleNext(steps)}
      />,
      isRequired: true
    },
    {
      id: 6,
      component: <PhoneNumberStep
        value={answers.phone || ''}
        onAnswer={(value) => handleAnswer('phone', value, steps)}
        onNext={handleComplete}
      />,
      isRequired: true
    }
  ];

  const progress = steps.length > 0 ? ((currentStep) / (steps.length - 1)) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12">
      <div className="max-w-xl mx-auto space-y-8 px-4 sm:px-6">
        <div className="flex justify-center mb-8">
          <img 
            src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png" 
            alt="Logo" 
            className="h-12" 
          />
        </div>
        
        <Progress value={progress} className="w-full h-2" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[400px]"
          >
            {steps[currentStep]?.component}
          </motion.div>
        </AnimatePresence>

        {currentStep > 0 && currentStep < steps.length && (
          <div className="flex justify-between items-center mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-32 text-gray-900 hover:text-gray-900"
            >
              Back
            </Button>
            {currentStep < steps.length - 1 && (
              <Button
                onClick={() => handleNext(steps)}
                className="w-32 text-white hover:text-white"
                disabled={steps[currentStep]?.isMultiSelect ? !answers[Object.keys(answers)[currentStep - 1]]?.length : false}
              >
                Next
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};