import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onProceed: () => void;
  disabled?: boolean;
  isLoading?: boolean;
  onCancel?: () => void;
}

export const ActionButtons = ({ onProceed, disabled, isLoading, onCancel }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end mt-6 space-x-4">
      {onCancel && (
        <Button
          onClick={onCancel}
          variant="outline"
          disabled={isLoading}
        >
          Cancel
        </Button>
      )}
      <Button
        onClick={onProceed}
        className="bg-primary hover:bg-primary-dark text-white px-6"
        disabled={disabled || isLoading}
      >
        Proceed to Shipping
      </Button>
    </div>
  );
};