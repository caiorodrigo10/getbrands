import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { PhoneStep } from "./steps/PhoneStep";
import { ProfileTypeStep } from "./steps/ProfileTypeStep";
import { ProductInterestStep } from "./steps/ProductInterestStep";
import { InstagramStep } from "./steps/InstagramStep";

interface QuizAnswers {
  phone: string;
  profile_type: string;
  product_interest: string;
  instagram: string;
}

export function OnboardingQuiz() {
  const [currentStep, setCurrentStep] = useState(1);
  const [answers, setAnswers] = useState<QuizAnswers>({
    phone: "",
    profile_type: "",
    product_interest: "",
    instagram: ""
  });
  const navigate = useNavigate();
  const { user } = useAuth();

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const handleNext = async () => {
    if (currentStep === totalSteps) {
      try {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            phone: answers.phone,
            profile_type: answers.profile_type,
            product_interest: answers.product_interest,
            instagram_handle: answers.instagram,
            onboarding_completed: true
          })
          .eq("id", user?.id);

        if (profileError) throw profileError;

        toast.success("Profile updated successfully!");
        navigate("/get-started");
      } catch (error) {
        console.error("Error saving onboarding data:", error);
        toast.error("Failed to save your responses. Please try again.");
      }
    } else {
      setCurrentStep(prev => prev + 1);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return answers.phone.length >= 10;
      case 2:
        return answers.profile_type !== "";
      case 3:
        return answers.product_interest !== "";
      case 4:
        return answers.instagram !== "";
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <PhoneStep
            value={answers.phone}
            onChange={(value) => setAnswers({ ...answers, phone: value })}
          />
        );
      case 2:
        return (
          <ProfileTypeStep
            value={answers.profile_type}
            onChange={(value) => setAnswers({ ...answers, profile_type: value })}
          />
        );
      case 3:
        return (
          <ProductInterestStep
            value={answers.product_interest}
            onChange={(value) => setAnswers({ ...answers, product_interest: value })}
          />
        );
      case 4:
        return (
          <InstagramStep
            value={answers.instagram}
            onChange={(value) => setAnswers({ ...answers, instagram: value })}
          />
        );
      default:
        return null;
    }
  };

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
          >
            <Card className="p-8">
              {renderStep()}
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex justify-end">
          <Button
            onClick={handleNext}
            disabled={!isStepValid()}
            size="lg"
          >
            {currentStep === totalSteps ? "Complete" : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}