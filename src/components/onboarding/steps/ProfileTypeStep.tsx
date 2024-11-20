import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface ProfileTypeStepProps {
  selected: string;
  onAnswer: (type: string) => void;
  onNext: () => void;
}

const profileTypes = [
  { id: "creator", label: "Creator/Influencer" },
  { id: "entrepreneur", label: "Entrepreneur" },
  { id: "marketer", label: "Digital Marketer" }
];

export const ProfileTypeStep = ({ 
  selected, 
  onAnswer,
  onNext 
}: ProfileTypeStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Which of the following best describes you?
        </h2>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={onAnswer}
        className="grid gap-4"
      >
        {profileTypes.map((type, index) => (
          <motion.div
            key={type.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <Label
              htmlFor={type.id}
              className={`
                flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected === type.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <RadioGroupItem value={type.id} id={type.id} />
              <span className="text-xl">{type.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};