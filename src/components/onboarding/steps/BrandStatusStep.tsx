import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface BrandStatusStepProps {
  selected: string;
  onAnswer: (status: string) => void;
  onNext: () => void;
}

const brandStatuses = [
  { id: "complete", label: "Yes, complete branding" },
  { id: "partial", label: "Partial branding" },
  { id: "none", label: "No, need full support" }
];

export const BrandStatusStep = ({ 
  selected, 
  onAnswer,
  onNext 
}: BrandStatusStepProps) => {
  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          Do you already have branding?
        </h2>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={onAnswer}
        className="grid gap-4"
      >
        {brandStatuses.map((status, index) => (
          <motion.div
            key={status.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <Label
              htmlFor={status.id}
              className={`
                flex items-center space-x-3 p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected === status.id ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <RadioGroupItem value={status.id} id={status.id} />
              <span className="text-xl">{status.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>
    </div>
  );
};