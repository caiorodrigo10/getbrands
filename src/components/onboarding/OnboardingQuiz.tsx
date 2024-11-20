import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import { CompletionStep } from "./steps/CompletionStep";

export type QuizStep = {
  id: number;
  component: React.ReactNode;
};

export const OnboardingQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswer = (stepId: string, answer: any) => {
    setAnswers(prev => ({ ...prev, [stepId]: answer }));
  };

  const steps: QuizStep[] = [
    { id: 1, component: <WelcomeStep onNext={handleNext} /> },
    { 
      id: 2, 
      component: <ProductCategoriesStep 
        selected={answers.categories || []}
        onAnswer={(value) => handleAnswer('categories', value)}
        onNext={handleNext}
      /> 
    },
    { 
      id: 3, 
      component: <ProfileTypeStep 
        selected={answers.profileType}
        onAnswer={(value) => handleAnswer('profileType', value)}
        onNext={handleNext}
      /> 
    },
    { 
      id: 4, 
      component: <BrandStatusStep 
        selected={answers.brandStatus}
        onAnswer={(value) => handleAnswer('brandStatus', value)}
        onNext={handleNext}
      /> 
    },
    { 
      id: 5, 
      component: <LaunchUrgencyStep 
        selected={answers.launchUrgency}
        onAnswer={(value) => handleAnswer('launchUrgency', value)}
        onNext={handleNext}
      /> 
    },
    { id: 6, component: <CompletionStep /> }
  ];

  const progress = ((currentStep) / (steps.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Progress value={progress} className="h-2" />
        
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="min-h-[400px]"
          >
            {steps[currentStep].component}
          </motion.div>
        </AnimatePresence>

        {currentStep > 0 && currentStep < steps.length - 1 && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-32"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};