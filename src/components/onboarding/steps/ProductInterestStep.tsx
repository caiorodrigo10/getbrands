import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { productCategories } from "../onboardingData";

interface ProductInterestStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProductInterestStep({ value, onChange }: ProductInterestStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">What product category interests you most?</h2>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid gap-4 max-w-md mx-auto"
      >
        {productCategories.map((category) => (
          <Label
            key={category}
            className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
          >
            <RadioGroupItem value={category} />
            <span>{category}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}