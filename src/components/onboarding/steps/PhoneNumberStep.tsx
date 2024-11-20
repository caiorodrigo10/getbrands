import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface PhoneNumberStepProps {
  onAnswer: (phone: string) => void;
  onNext: () => void;
}

export const PhoneNumberStep = ({ onAnswer, onNext }: PhoneNumberStepProps) => {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState("");

  const validatePhone = (value: string) => {
    // Basic phone validation - can be enhanced based on requirements
    const phoneRegex = /^\+?[\d\s-]{10,}$/;
    return phoneRegex.test(value);
  };

  const handleSubmit = () => {
    if (!validatePhone(phone)) {
      setError("Please enter a valid phone number");
      toast.error("Please enter a valid phone number");
      return;
    }
    
    onAnswer(phone);
    onNext();
  };

  return (
    <motion.div 
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Please provide your phone number so we can stay in touch
        </h2>
      </div>

      <div className="max-w-md mx-auto space-y-4">
        <Input
          type="tel"
          placeholder="+1 555-555-5555"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setError("");
          }}
          className={`text-lg p-6 ${error ? 'border-red-500' : ''}`}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <Button
        onClick={handleSubmit}
        size="lg"
        className="mt-4"
      >
        Submit
      </Button>
    </motion.div>
  );
};