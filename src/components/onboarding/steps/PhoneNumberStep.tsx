import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

interface PhoneNumberStepProps {
  value: string;
  onAnswer: (phone: string) => void;
  onNext: () => void;
}

export const PhoneNumberStep = ({ value, onAnswer, onNext }: PhoneNumberStepProps) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value) {
      onNext();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          What's your phone number?
        </h2>
        <p className="text-gray-500 text-base sm:text-lg">
          We'll use this to keep you updated on your project progress.
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <PhoneInput
          country={'us'}
          value={value}
          onChange={(phone) => onAnswer(phone)}
          containerClass="w-full"
          inputClass="w-full h-14 text-lg px-12 border border-input rounded-md"
          buttonClass="!border-input !h-14 !w-12"
          dropdownClass="!w-[300px]"
          searchClass="!w-full"
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!value}
        >
          Complete Onboarding
        </Button>
      </motion.div>
    </form>
  );
};