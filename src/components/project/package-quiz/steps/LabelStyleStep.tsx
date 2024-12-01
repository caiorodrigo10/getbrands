import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

interface LabelStyleStepProps {
  defaultValue: string;
  onValueChange: (value: string) => void;
}

export const LabelStyleStep = ({ defaultValue, onValueChange }: LabelStyleStepProps) => {
  return (
    <div className="space-y-6">
      <RadioGroup
        defaultValue={defaultValue}
        onValueChange={onValueChange}
      >
        <div className="grid gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="match" id="match" />
            <Label htmlFor="match" className="text-base">
              Match brand identity closely
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="complement" id="complement" />
            <Label htmlFor="complement" className="text-base">
              Complement brand identity
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="key-elements" id="key-elements" />
            <Label htmlFor="key-elements" className="text-base">
              Include key elements only
            </Label>
          </div>
        </div>
      </RadioGroup>
    </div>
  );
};