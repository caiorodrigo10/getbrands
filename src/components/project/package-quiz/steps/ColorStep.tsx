import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

interface ColorStepProps {
  primaryColor: string;
  secondaryColor: string;
  onPrimaryColorChange: (value: string) => void;
  onSecondaryColorChange: (value: string) => void;
}

export const ColorStep = ({
  primaryColor,
  secondaryColor,
  onPrimaryColorChange,
  onSecondaryColorChange,
}: ColorStepProps) => {
  return (
    <div className="space-y-6">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label htmlFor="primary-color">Primary Color</Label>
          <div className="flex space-x-2">
            <Input
              type="color"
              id="primary-color"
              value={primaryColor}
              className="w-16 h-10"
              onChange={(e) => onPrimaryColorChange(e.target.value)}
            />
            <Input
              type="text"
              value={primaryColor}
              className="flex-1"
              onChange={(e) => onPrimaryColorChange(e.target.value)}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="secondary-color">Secondary Color</Label>
          <div className="flex space-x-2">
            <Input
              type="color"
              id="secondary-color"
              value={secondaryColor}
              className="w-16 h-10"
              onChange={(e) => onSecondaryColorChange(e.target.value)}
            />
            <Input
              type="text"
              value={secondaryColor}
              className="flex-1"
              onChange={(e) => onSecondaryColorChange(e.target.value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};