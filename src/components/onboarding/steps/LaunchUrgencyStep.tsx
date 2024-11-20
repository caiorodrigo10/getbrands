import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface LaunchUrgencyStepProps {
  value: string;
  onChange: (value: string) => void;
  onNext: () => void;
}

export function LaunchUrgencyStep({ value, onChange, onNext }: LaunchUrgencyStepProps) {
  const options = [
    { value: "immediate", label: "Immediately (1-2 months)" },
    { value: "soon", label: "Soon (3-6 months)" },
    { value: "planning", label: "Planning Phase (6+ months)" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">When are you planning to launch?</h2>
        <p className="text-muted-foreground">
          This helps us understand your timeline and prioritize your needs
        </p>
      </div>

      <div className="grid gap-4">
        {options.map((option) => (
          <Card
            key={option.value}
            className={cn(
              "p-4 cursor-pointer transition-all hover:border-primary",
              value === option.value && "border-2 border-primary"
            )}
            onClick={() => onChange(option.value)}
          >
            <div className="font-medium">{option.label}</div>
          </Card>
        ))}
      </div>

      <Button 
        onClick={onNext} 
        disabled={!value}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}