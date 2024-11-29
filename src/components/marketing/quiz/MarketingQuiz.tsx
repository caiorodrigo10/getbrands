import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { QuizQuestion } from "./QuizQuestion";
import { ComparisonResults } from "./ComparisonResults";
import { useQuizData } from "./useQuizData";
import { QuizIntro } from "./QuizIntro";

export type QuizStep = {
  id: number;
  question: string;
  options: string[];
  type: "single" | "multiple";
};

const steps: QuizStep[] = [
  {
    id: 1,
    question: "What product category are you most interested in?",
    options: ["Cosmetics", "Coffee", "Supplements", "Pet Products"],
    type: "single"
  },
  {
    id: 2,
    question: "What is your target market size?",
    options: ["Local", "Regional", "National", "International"],
    type: "single"
  },
  {
    id: 3,
    question: "Do you already have branding?",
    options: ["Yes, complete branding", "Partial branding", "No, need full support"],
    type: "single"
  },
  {
    id: 4,
    question: "What is your primary goal with your private label?",
    options: ["Additional Income", "Passion Project", "Scaling Business", "Other"],
    type: "single"
  }
];

export const MarketingQuiz = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const { answers, setAnswer, saveQuizData } = useQuizData();

  const progress = ((currentStep) / (steps.length + 1)) * 100;

  const handleNext = async () => {
    if (currentStep === steps.length) {
      await saveQuizData();
      setShowResults(true);
    } else {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-white py-12 px-4">
      <div className="max-w-3xl mx-auto space-y-8">
        <Progress value={progress} className="h-2" />
        
        <AnimatePresence mode="wait">
          {currentStep === 0 && (
            <motion.div
              key="intro"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <QuizIntro onStart={() => setCurrentStep(1)} />
            </motion.div>
          )}

          {currentStep > 0 && !showResults && (
            <motion.div
              key={`step-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Card className="p-6">
                <QuizQuestion
                  step={steps[currentStep - 1]}
                  answer={answers[steps[currentStep - 1].id]}
                  onAnswer={(answer) => setAnswer(steps[currentStep - 1].id, answer)}
                />
              </Card>
            </motion.div>
          )}

          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
            >
              <ComparisonResults answers={answers} />
            </motion.div>
          )}
        </AnimatePresence>

        {currentStep > 0 && !showResults && (
          <div className="flex justify-between mt-6">
            <Button
              variant="outline"
              onClick={handleBack}
              className="w-32"
            >
              Back
            </Button>
            <Button
              onClick={handleNext}
              className="w-32"
            >
              {currentStep === steps.length ? "See Results" : "Next"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};