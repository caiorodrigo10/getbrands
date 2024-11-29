import { motion } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { QuizNavigation } from "@/components/onboarding/steps/QuizNavigation";

interface LaunchUrgencyStepProps {
  selected: string;
  email: string;
  phone: string;
  onAnswer: (value: string) => void;
  onEmailChange: (email: string) => void;
  onPhoneChange: (phone: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export const LaunchUrgencyStepMktPT = ({ 
  selected, 
  email,
  phone,
  onAnswer,
  onEmailChange,
  onPhoneChange,
  onComplete,
  onBack
}: LaunchUrgencyStepProps) => {
  const options = [
    { value: "immediate", label: "Imediatamente (1-2 meses)" },
    { value: "soon", label: "Em breve (3-6 meses)" },
    { value: "planning", label: "Fase de Planejamento (6+ meses)" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8">
      <div className="text-center">
        <h2 className="text-xl sm:text-3xl font-bold text-gray-900 mb-4">
          Quando você planeja lançar?
        </h2>
        <p className="text-sm sm:text-base text-gray-600 mb-4">
          Isso nos ajuda a entender seu cronograma e priorizar suas necessidades
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

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => onEmailChange(e.target.value)}
            placeholder="seu@email.com"
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Telefone</Label>
          <Input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value)}
            placeholder="(00) 00000-0000"
          />
        </div>
      </div>

      <QuizNavigation
        onNext={onComplete}
        onBack={onBack}
        nextLabel="Completar"
        isNextDisabled={!selected || !email}
      />
    </div>
  );
};