import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface PhoneNumberStepProps {
  value: string;
  onAnswer: (phone: string) => void;
  onNext: () => void;
}

export const PhoneNumberStep = ({ value, onAnswer, onNext }: PhoneNumberStepProps) => {
  const formatPhoneNumber = (input: string) => {
    // Remove all non-digits
    const numbers = input.replace(/\D/g, '');
    
    // Format the number as (XXX) XXX-XXXX
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return `(${numbers.slice(0, 3)}) ${numbers.slice(3)}`;
    return `(${numbers.slice(0, 3)}) ${numbers.slice(3, 6)}-${numbers.slice(6, 10)}`;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value);
    onAnswer(formatted);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value.match(/^\(\d{3}\) \d{3}-\d{4}$/)) {
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
        <Input
          type="tel"
          placeholder="(555) 555-5555"
          className="w-full text-lg p-4"
          value={value}
          onChange={handleChange}
          maxLength={14}
        />

        <Button
          type="submit"
          className="w-full"
          disabled={!value.match(/^\(\d{3}\) \d{3}-\d{4}$/)}
        >
          Complete Onboarding
        </Button>
      </motion.div>
    </form>
  );
};