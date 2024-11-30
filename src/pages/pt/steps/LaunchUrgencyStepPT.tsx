import { useLocation } from "react-router-dom";
import { QuizNavigation } from "@/components/onboarding/steps/QuizNavigation";
import { Card } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LaunchUrgencyStepPTProps {
  selected: string;
  onAnswer: (value: string) => void;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
}

export const LaunchUrgencyStepPT = ({
  selected,
  onAnswer,
  onNext,
  onBack,
  onComplete,
}: LaunchUrgencyStepPTProps) => {
  const location = useLocation();
  const isOnboardingRoute = location.pathname === "/pt/onboarding";

  const handleAnswer = (value: string) => {
    onAnswer(value);
  };

  return (
    <Card className="w-full max-w-2xl p-8">
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900">
            Quando você planeja lançar?
          </h2>
          <p className="text-lg text-gray-600">
            Selecione a opção que melhor descreve seu cronograma
          </p>
        </div>

        <RadioGroup
          value={selected}
          onValueChange={handleAnswer}
          className="grid gap-4"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="immediately" id="immediately" />
            <Label htmlFor="immediately" className="text-base">
              Imediatamente
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1-3_months" id="1-3_months" />
            <Label htmlFor="1-3_months" className="text-base">
              1-3 meses
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3-6_months" id="3-6_months" />
            <Label htmlFor="3-6_months" className="text-base">
              3-6 meses
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="6+_months" id="6+_months" />
            <Label htmlFor="6+_months" className="text-base">
              6+ meses
            </Label>
          </div>
        </RadioGroup>

        <QuizNavigation
          onNext={isOnboardingRoute ? onComplete : onNext}
          onBack={onBack}
          nextLabel={isOnboardingRoute ? "Completar" : "Próximo"}
          backLabel="Voltar"
          isNextDisabled={!selected}
        />
      </div>
    </Card>
  );
};