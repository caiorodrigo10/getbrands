import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LaunchUrgencyStepProps {
  selected: string;
  onAnswer: (urgency: string) => void;
  onNext: () => void;
}

const urgencyOptions = [
  { id: "As soon as possible", label: "As soon as possible" },
  { id: "Within 1-3 months", label: "Within 1-3 months" },
  { id: "Flexible timeline", label: "Flexible timeline" }
];

export const LaunchUrgencyStep = ({ 
  selected, 
  onAnswer,
  onNext 
}: LaunchUrgencyStepProps) => {
  const handleSelect = (value: string) => {
    onAnswer(value);
    onNext(); // Auto-advance after selection
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          When are you looking to launch?
        </h2>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={handleSelect}
        className="grid gap-4"
      >
        {urgencyOptions.map((option, index) => (
          <motion.div
            key={option.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <Label
              htmlFor={option.id}
              className={`
                flex items-center space-x-3 p-4 sm:p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <span className="text-base sm:text-xl">{option.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};