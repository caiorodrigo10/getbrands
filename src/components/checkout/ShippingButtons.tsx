import { Button } from "@/components/ui/button";

interface ShippingButtonsProps {
  isAddressSaved: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onSave: () => void;
}

export const ShippingButtons = ({
  isAddressSaved,
  onCancel,
  onContinue,
  onSave,
}: ShippingButtonsProps) => {
  return (
    <div className="flex justify-between mt-6">
      <Button
        type="button"
        variant="outline"
        onClick={onCancel}
      >
        Cancel
      </Button>
      {isAddressSaved ? (
        <Button
          type="button"
          onClick={onContinue}
        >
          Continue to Payment
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSave}
        >
          Save Address
        </Button>
      )}
    </div>
  );
};