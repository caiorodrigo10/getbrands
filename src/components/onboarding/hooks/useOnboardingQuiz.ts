import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { saveOnboardingData, OnboardingData } from "@/services/onboardingService";
import { useNavigate } from "react-router-dom";

type OnboardingAnswers = {
  phone?: string;
  profileType?: 'Creator/Influencer' | 'Entrepreneur' | 'Digital Marketer';
  categories?: string[];
  brandStatus?: 'existing' | 'new';
  launchUrgency?: 'immediate' | 'one_to_three' | 'flexible';
};

export const useOnboardingQuiz = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<OnboardingAnswers>({});

  const validateCurrentStep = (step: any) => {
    if (!step) return true;

    if (step.isRequired) {
      const answer = answers[Object.keys(answers)[currentStep - 1]];
      if (!answer || (Array.isArray(answer) && answer.length === 0)) {
        return false;
      }
    }
    return true;
  };

  const handleNext = (steps: any[]) => {
    if (!validateCurrentStep(steps[currentStep])) {
      toast.error("Please fill in all required fields");
      return;
    }
    
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

    // Only auto-advance for single select fields, without validation
    if (!steps[currentStep]?.isMultiSelect && currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
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

    const onboardingData: OnboardingData = {
      phone: answers.phone,
      profile_type: answers.profileType as 'Creator/Influencer' | 'Entrepreneur' | 'Digital Marketer',
      product_interest: answers.categories || [],
      brand_status: answers.brandStatus === 'existing' 
        ? 'I already have a brand' 
        : 'I\'m creating a new brand',
      launch_urgency: answers.launchUrgency === 'immediate' 
        ? 'As soon as possible'
        : answers.launchUrgency === 'one_to_three'
        ? 'Within 1-3 months'
        : 'Flexible timeline'
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