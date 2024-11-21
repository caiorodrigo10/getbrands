import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface BrandStatusStepProps {
  selected: string;
  onAnswer: (value: string) => void;
  onNext: () => void;
}

export function BrandStatusStep({ selected, onAnswer, onNext }: BrandStatusStepProps) {
  const options = [
    { value: "no_brand", label: "Starting from scratch" },
    { value: "partial_brand", label: "Have some branding elements" },
    { value: "complete_brand", label: "Complete brand identity" },
  ];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">What's your current brand status?</h2>
        <p className="text-muted-foreground">
          Tell us about your current branding situation
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

      <Button 
        onClick={onNext} 
        disabled={!selected}
        className="w-full"
      >
        Continue
      </Button>
    </div>
  );
}