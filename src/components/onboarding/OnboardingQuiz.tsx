import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { WelcomeStep } from "./steps/WelcomeStep";
import { ProductCategoriesStep } from "./steps/ProductCategoriesStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { BrandStatusStep } from "./steps/BrandStatusStep";
import { LaunchUrgencyStep } from "./steps/LaunchUrgencyStep";
import type { OnboardingQuizData } from "@/types/quiz";
import { toast } from "sonner";

export const OnboardingQuiz = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  useEffect(() => {
    // Check authentication status
    if (!isAuthenticated) {
      toast.error("Please log in to continue");
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

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

  const isStepValid = (step: number) => {
    if (step === 0) return true; // Welcome step
    
    const currentAnswer = answers[Object.keys(answers)[step - 1]];
    if (Array.isArray(currentAnswer)) {
      return currentAnswer.length > 0;
    }
    return !!currentAnswer;
  };

  const saveQuizData = async () => {
    if (!user?.id) {
      toast.error("Authentication error. Please log in again.");
      navigate('/login');
      return;
    }

    try {
      const quizData: OnboardingQuizData = {
        product_interest: answers.categories || [],
        profile_type: answers.profileType || "",
        brand_status: answers.brandStatus || "",
        launch_urgency: answers.launchUrgency || "",
      };

      const { error } = await supabase
        .from("profiles")
        .update({
          ...quizData,
          onboarding_completed: true,
        })
        .eq("id", user.id);

      if (error) {
        console.error("Error saving quiz data:", error);
        throw error;
      }
      
      navigate('/start-here');
    } catch (error) {
      console.error("Error saving quiz data:", error);
      toast.error("Failed to save your answers. Please try again.");
    }
  };

  const steps = [
    { 
      id: '1', 
      component: <WelcomeStep onNext={handleNext} />,
      isRequired: false
    },
    { 
      id: '2', 
      component: <ProductCategoriesStep 
        selected={answers.categories || []}
        onAnswer={(value) => handleAnswer('categories', value)}
        onNext={handleNext}
      />,
      isMultiSelect: true,
      isRequired: true
    },
    { 
      id: '3', 
      component: <ProfileTypeStep 
        selected={answers.profileType}
        onAnswer={(value) => handleAnswer('profileType', value)}
        onNext={handleNext}
      />,
      isRequired: true
    },
    { 
      id: '4', 
      component: <BrandStatusStep 
        selected={answers.brandStatus}
        onAnswer={(value) => handleAnswer('brandStatus', value)}
        onNext={handleNext}
      />,
      isRequired: true
    },
    { 
      id: '5', 
      component: <LaunchUrgencyStep 
        selected={answers.launchUrgency}
        onAnswer={(value) => handleAnswer('launchUrgency', value)}
        onComplete={saveQuizData}
      />,
      isRequired: true
    }
  ];

  const progress = ((currentStep) / (steps.length)) * 100;

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-white py-12">
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
                className="w-32 bg-primary text-white hover:bg-primary/90 disabled:bg-primary disabled:opacity-50"
                disabled={!isStepValid(currentStep)}
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