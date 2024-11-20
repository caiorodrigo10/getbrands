import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useNavigate } from "react-router-dom";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import { PhoneNumberStep } from "./steps/PhoneNumberStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useAuth } from "@/contexts/AuthContext";
import { saveOnboardingData } from "@/services/onboardingService";
import { toast } from "sonner";

export type QuizStep = {
  id: number;
  component: React.ReactNode;
  isMultiSelect?: boolean;
};

export const OnboardingQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
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

  const handleAnswer = async (stepId: string, answer: any) => {
    const newAnswers = { ...answers, [stepId]: answer };
    setAnswers(newAnswers);

    if (!steps[currentStep]?.isMultiSelect && currentStep < steps.length - 1) {
      handleNext();
    }
  };

  const handleComplete = async () => {
    if (!user?.id) {
      toast.error('You must be logged in to complete the onboarding');
      return;
    }

    if (!answers.phone) {
      toast.error('Please enter your phone number');
      return;
    }

    const onboardingData = {
      phone: answers.phone,
      profile_type: answers.profileType,
      product_interest: answers.categories || [],
      brand_status: answers.brandStatus,
      launch_urgency: answers.launchUrgency
    };

    const result = await saveOnboardingData(user.id, onboardingData);
    
    if (result.status === 'success') {
      toast.success(result.message);
      navigate('/start-here');
    } else {
      toast.error(result.message);
    }
  };

  const steps: QuizStep[] = [
    { 
      id: 1, 
      component: <WelcomeStep onNext={handleNext} /> 
    },
    { 
      id: 2, 
      component: <ProductCategoriesStep 
        selected={answers.categories || []}
        onAnswer={(value) => handleAnswer('categories', value)}
        onNext={handleNext}
      />,
      isMultiSelect: true
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
    {
      id: 6,
      component: <PhoneNumberStep
        value={answers.phone || ''}
        onAnswer={(value) => handleAnswer('phone', value)}
        onNext={handleComplete}
      />
    }
  ];

  // Ensure we have valid steps before calculating progress
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
                onClick={handleNext}
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