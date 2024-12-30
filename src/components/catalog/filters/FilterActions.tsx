import { Button } from "@/components/ui/button";

interface FilterActionsProps {
  onClear: () => void;
  onApply: () => void;
}

export const FilterActions = ({ onClear, onApply }: FilterActionsProps) => {
  return (
    <div className="flex justify-between">
      <Button
        variant="ghost"
        size="sm"
        onClick={onClear}
        className="text-sm"
      >
        Clear
      </Button>
      <Button 
        size="sm" 
        className="text-sm"
        onClick={onApply}
      >
        Apply filter
      </Button>
    </div>
  );
};