import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface ShippingButtonsProps {
  isAddressSaved: boolean;
  onCancel: () => void;
  onContinue: () => void;
}

export const ShippingButtons = ({ isAddressSaved, onCancel, onContinue }: ShippingButtonsProps) => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCancel = async () => {
    if (isProcessing) return;
    setIsProcessing(true);
    
    try {
      await clearCart();
      onCancel();
      toast({
        description: "Order cancelled and cart cleared.",
      });
      navigate("/checkout/confirmation");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel order. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleContinue = () => {
    if (isProcessing || !isAddressSaved) return;
    setIsProcessing(true);
    
    try {
      onContinue();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 sm:gap-4 mt-6">
      <Button
        type="button"
        variant="destructive"
        className="text-sm sm:text-base px-3 sm:px-4 h-10 sm:h-11 w-full sm:w-auto"
        onClick={handleCancel}
        disabled={isProcessing}
      >
        {isProcessing ? "Processing..." : "Cancel Order"}
      </Button>
      <Button
        type="button"
        variant={isAddressSaved ? "default" : "secondary"}
        className={`text-sm sm:text-base px-3 sm:px-4 h-12 sm:h-14 w-full sm:w-auto ${
          isAddressSaved ? "bg-green-600 hover:bg-green-700" : ""
        }`}
        disabled={!isAddressSaved || isProcessing}
        onClick={handleContinue}
      >
        {isProcessing ? "Processing..." : "Continue to Payment"}
      </Button>
    </div>
  );
};