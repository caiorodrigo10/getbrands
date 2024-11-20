import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface PhoneNumberStepProps {
  onAnswer: (phone: string) => void;
  onNext: () => void;
}

export const PhoneNumberStep = ({ onAnswer, onNext }: PhoneNumberStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          What's your phone number?
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          We'll use this to keep you updated about your project
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Input
          type="tel"
          placeholder="(555) 555-5555"
          className="w-full text-lg p-4"
          onChange={(e) => onAnswer(e.target.value)}
        />
      </motion.div>

      <Button
        onClick={onNext}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
};