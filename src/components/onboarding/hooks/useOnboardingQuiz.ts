import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { saveOnboardingData } from "@/services/onboardingService";
import { useNavigate } from "react-router-dom";

export const useOnboardingQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, any>>({});

  const validateCurrentStep = (step: any) => {
    if (!step) return true;

    if (step.isRequired) {
      const answer = answers[Object.keys(answers)[currentStep - 1]];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        toast.error("Please fill in all required fields");
        return false;
      }
    }
    return true;
  };

  const handleNext = (steps: any[]) => {
    if (!validateCurrentStep(steps[currentStep])) return;
    
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleAnswer = async (stepId: string, answer: any, steps: any[]) => {
    const newAnswers = { ...answers, [stepId]: answer };
    setAnswers(newAnswers);

    if (!steps[currentStep]?.isMultiSelect && currentStep < steps.length - 1) {
      handleNext(steps);
    }
  };

  const handleComplete = async () => {
    if (!user?.id) {
      toast.error('You need to be logged in to complete the onboarding');
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

  return {
    currentStep,
    answers,
    handleNext,
    handleBack,
    handleAnswer,
    handleComplete
  };
};