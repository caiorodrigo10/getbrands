import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

interface ShippingButtonsProps {
  isAddressSaved: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onSave: () => void;
}

export const ShippingButtons = ({ isAddressSaved, onCancel, onContinue, onSave }: ShippingButtonsProps) => {
  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button 
          type="button"
          variant="default"
          className="w-[150px]"
          onClick={onSave}
        >
          Save Address
        </Button>
      </div>
      
      <div className="flex justify-end gap-4">
        <Button
          type="button"
          variant="destructive"
          onClick={onCancel}
        >
          Cancel Order
        </Button>
        <Button
          type="button"
          variant={isAddressSaved ? "default" : "secondary"}
          className={isAddressSaved ? "bg-green-600 hover:bg-green-700" : ""}
          disabled={!isAddressSaved}
          onClick={onContinue}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};