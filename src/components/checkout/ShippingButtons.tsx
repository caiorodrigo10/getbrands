
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";

interface ShippingButtonsProps {
  isAddressSaved: boolean;
  onCancel: () => void;
  onContinue: () => void;
  onSave: () => void;
}

export const ShippingButtons = ({ isAddressSaved, onCancel, onContinue, onSave }: ShippingButtonsProps) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();

  const handleCancel = () => {
    // Just navigate back without clearing the cart
    onCancel();
    navigate("/checkout/confirmation");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button 
          type="button"
          variant="default"
          className="w-[150px] h-8 sm:h-9"
          onClick={onSave}
        >
          Save Address
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4">
        <Button
          type="button"
          variant="destructive"
          className="text-sm sm:text-base px-3 sm:px-4 h-10 sm:h-11 w-full sm:w-auto"
          onClick={handleCancel}
        >
          Cancel Order
        </Button>
        <Button
          type="button"
          variant={isAddressSaved ? "default" : "secondary"}
          className={`text-sm sm:text-base px-3 sm:px-4 h-12 sm:h-14 w-full sm:w-auto ${
            isAddressSaved ? "bg-green-600 hover:bg-green-700" : ""
          }`}
          disabled={!isAddressSaved}
          onClick={onContinue}
        >
          Continue to Payment
        </Button>
      </div>
    </div>
  );
};
