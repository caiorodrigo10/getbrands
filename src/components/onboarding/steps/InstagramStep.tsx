import { Input } from "@/components/ui/input";

interface InstagramStepProps {
  value: string;
  onChange: (value: string) => void;
}

export function InstagramStep({ value, onChange }: InstagramStepProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold text-center">What's your Instagram handle?</h2>
      <p className="text-muted-foreground text-center">
        We'll use this to better understand your brand aesthetic
      </p>
      <Input
        type="text"
        placeholder="@yourbrand"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="max-w-md mx-auto"
      />
    </div>
  );
}