import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface QuizAnswers {
  phone: string;
  profile_type: string;
  product_interest: string;
  instagram: string;
}

const profileTypes = [
  "Creator/Influencer",
  "Marketing/Ecommerce Professional",
  "Entrepreneur",
  "Healthcare Professional",
  "Other"
];

const productCategories = [
  "Cosmetics",
  "Coffee",
  "Supplements",
  "Pet Products",
  "Apparel"
];

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
        // Save quiz answers
        const { error } = await supabase
          .from("onboarding_responses")
          .insert({
            user_id: user?.id,
            answers
          });

        if (error) throw error;

        // Update user profile
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
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">What's your phone number?</h2>
            <p className="text-muted-foreground text-center">
              We'll use this to keep you updated on your brand journey
            </p>
            <Input
              type="tel"
              placeholder="(555) 555-5555"
              value={answers.phone}
              onChange={(e) => setAnswers({ ...answers, phone: e.target.value })}
              className="max-w-md mx-auto"
            />
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">What best describes you?</h2>
            <RadioGroup
              value={answers.profile_type}
              onValueChange={(value) => setAnswers({ ...answers, profile_type: value })}
              className="grid gap-4 max-w-md mx-auto"
            >
              {profileTypes.map((type) => (
                <Label
                  key={type}
                  className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
                >
                  <RadioGroupItem value={type} id={type} />
                  <span>{type}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">What product category interests you most?</h2>
            <RadioGroup
              value={answers.product_interest}
              onValueChange={(value) => setAnswers({ ...answers, product_interest: value })}
              className="grid gap-4 max-w-md mx-auto"
            >
              {productCategories.map((category) => (
                <Label
                  key={category}
                  className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
                >
                  <RadioGroupItem value={category} id={category} />
                  <span>{category}</span>
                </Label>
              ))}
            </RadioGroup>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-center">What's your Instagram handle?</h2>
            <p className="text-muted-foreground text-center">
              We'll use this to better understand your brand aesthetic
            </p>
            <Input
              type="text"
              placeholder="@yourbrand"
              value={answers.instagram}
              onChange={(e) => setAnswers({ ...answers, instagram: e.target.value })}
              className="max-w-md mx-auto"
            />
          </div>
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