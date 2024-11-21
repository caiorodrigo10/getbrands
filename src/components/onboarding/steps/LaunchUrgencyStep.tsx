import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { QuizNavigation } from "./QuizNavigation";

interface LaunchUrgencyStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onComplete: () => void;
  onBack: () => void;
}

export function LaunchUrgencyStep({ selected, onAnswer, onComplete, onBack }: LaunchUrgencyStepProps) {
  const options = [
    { value: "immediate", label: "Immediately (1-2 months)" },
    { value: "soon", label: "Soon (3-6 months)" },
    { value: "planning", label: "Planning Phase (6+ months)" },
  ];

  return (
    <div className="w-full max-w-2xl mx-auto space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold text-center">When are you planning to launch?</h2>
        <p className="text-muted-foreground text-center">
          This helps us understand your timeline and prioritize your needs
        </p>
      </div>

      <div className="grid gap-4">
        {options.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "p-4 cursor-pointer transition-all hover:border-primary",
              selected === option.value && "border-2 border-primary"
            )}
            onClick={() => onAnswer(option.value)}
          >
            <div className="font-medium">{option.label}</div>
          </Card>
        ))}
      </div>

      <QuizNavigation
        onNext={onComplete}
        onBack={onBack}
        nextLabel="Complete"
        isNextDisabled={!selected}
      />
    </div>
  );
}