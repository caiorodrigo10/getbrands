import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LaunchUrgencyStepProps {
  selected: string;
  onAnswer: (urgency: string) => void;
  onNext: () => void;
}

const urgencyOptions = [
  { id: "asap", label: "I need to launch as soon as possible" },
  { id: "3-6months", label: "I'm planning to launch in 3–6 months" },
  { id: "exploring", label: "I'm still exploring ideas" }
];

export const LaunchUrgencyStep = ({ 
  selected, 
  onAnswer,
  onNext 
}: LaunchUrgencyStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          What is your urgency for launching your first product?
        </h2>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={onAnswer}
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
                flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected === option.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <RadioGroupItem value={option.id} id={option.id} />
              <span className="text-xl">{option.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};