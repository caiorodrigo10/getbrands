import { Button } from "@/components/ui/button";

interface ActionButtonsProps {
  onProceed: () => void;
  disabled: boolean;
}

export const ActionButtons = ({ onProceed, disabled }: ActionButtonsProps) => {
  return (
    <div className="flex justify-end mt-6">
      <Button
        onClick={onProceed}
        className="bg-primary hover:bg-primary-dark text-white px-6"
        disabled={disabled}
      >
        Proceed to Shipping
      </Button>
    </div>
  );
};