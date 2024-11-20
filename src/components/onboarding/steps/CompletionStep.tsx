import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";

interface CompletionStepProps {
  onComplete: () => void;
}

export const CompletionStep = ({ onComplete }: CompletionStepProps) => {
  return (
    <motion.div 
      className="text-center space-y-6"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="flex justify-center">
        <CheckCircle2 className="w-16 h-16 text-primary" />
      </div>
      
      <h1 className="text-4xl font-bold text-gray-900">
        Thank you!
      </h1>
      
      <p className="text-xl text-gray-600 max-w-2xl mx-auto">
        We're excited to help you create your brand. Let's get started!
      </p>
      
      <Button 
        onClick={onComplete}
        size="lg"
        className="mt-8 px-8 py-6 text-xl"
      >
        Continue to Dashboard
      </Button>
    </motion.div>
  );
};