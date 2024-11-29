import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizNavigation } from "@/components/onboarding/steps/QuizNavigation";

interface BrandStatusStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
  onBack: () => void;
}

export const BrandStatusStepMktPT = ({ selected, onAnswer, onNext, onBack }: BrandStatusStepProps) => {
  const options = [
    { value: "no_brand", label: "Começando do zero" },
    { value: "partial_brand", label: "Tenho alguns elementos de marca" },
    { value: "complete_brand", label: "Identidade de marca completa" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          Qual é o status atual da sua marca?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Conte-nos sobre sua situação atual de branding
        </p>
      </div>

      <RadioGroup
        value={selected}
        onValueChange={onAnswer}
        className="grid gap-4"
      >
        {options.map((option, index) => (
          <motion.div
            key={option.value}
            initial={{ opacity: 0, y: 20 }}
            animate={{ 
              opacity: 1, 
              y: 0,
              transition: { delay: index * 0.1 }
            }}
          >
            <Label
              htmlFor={option.value}
              className={`
                flex items-center space-x-3 p-4 sm:p-6 rounded-xl border-2 cursor-pointer
                transition-all duration-200
                ${selected === option.value ? 'border-primary bg-primary/5' : 'border-gray-200 hover:border-primary/50'}
              `}
            >
              <RadioGroupItem value={option.value} id={option.value} />
              <span className="text-base sm:text-xl">{option.label}</span>
            </Label>
          </motion.div>
        ))}
      </RadioGroup>

      <QuizNavigation
        onNext={onNext}
        onBack={onBack}
        isNextDisabled={!selected}
      />
    </div>
  );
};