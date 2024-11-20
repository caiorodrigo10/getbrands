import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";

interface WelcomeStepProps {
  onNext: () => void;
}

export const WelcomeStep = ({ onNext }: WelcomeStepProps) => {
  return (
    <motion.div 
      className="text-center space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-4xl font-bold text-gray-900">
        Welcome to GetBrands!
      </h1>
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        Let's answer a few quick questions to help us customize your experience.
      </p>
      <Button 
        onClick={onNext}
        size="lg"
        className="mt-8 px-8 py-6 text-xl"
      >
        Start Quiz
      </Button>
    </motion.div>
  );
};