import { Input } from "@/components/ui/input";

interface PhoneStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function PhoneStep({ value, onChange }: PhoneStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">What's your phone number?</h2>
      <p className="text-muted-foreground text-center">
        We'll use this to keep you updated on your brand journey
      </p>
      <Input
        type="tel"
        placeholder="(555) 555-5555"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md mx-auto"
      />
    </div>
  );
}