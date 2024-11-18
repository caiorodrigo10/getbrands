import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { profileTypes } from "../onboardingData";

interface ProfileTypeStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function ProfileTypeStep({ value, onChange }: ProfileTypeStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">What best describes you?</h2>
      <RadioGroup
        value={value}
        onValueChange={onChange}
        className="grid gap-4 max-w-md mx-auto"
      >
        {profileTypes.map((type) => (
          <Label
            key={type}
            className="flex items-center space-x-3 p-4 border rounded-lg cursor-pointer hover:bg-accent"
          >
            <RadioGroupItem value={type} />
            <span>{type}</span>
          </Label>
        ))}
      </RadioGroup>
    </div>
  );
}