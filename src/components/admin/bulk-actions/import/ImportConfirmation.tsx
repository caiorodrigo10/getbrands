import { Button } from "@/components/ui/button";

interface ImportConfirmationProps {
  mappings: Record<string, string>;
  fields: { value: string; label: string }[];
  isProcessing: boolean;
  onConfirm: () => void;
}

export const ImportConfirmation = ({ 
  mappings, 
  fields, 
  isProcessing, 
  onConfirm 
}: ImportConfirmationProps) => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Review your mappings and confirm the import
      </p>
      {Object.entries(mappings).map(([header, field]) => (
        <div key={header} className="flex items-center gap-4">
          <span className="min-w-[200px] text-sm font-medium">{header}</span>
          <span className="text-sm text-muted-foreground">
            → {fields.find(f => f.value === field)?.label}
          </span>
        </div>
      ))}
      <Button
        className="mt-4"
        onClick={onConfirm}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Start Import"}
      </Button>
    </div>
  );
};