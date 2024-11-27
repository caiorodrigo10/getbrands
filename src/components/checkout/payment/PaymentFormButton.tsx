import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

interface PaymentFormButtonProps {
  isProcessing: boolean;
  isDisabled: boolean;
  total: number;
}

export const PaymentFormButton = ({ isProcessing, isDisabled, total }: PaymentFormButtonProps) => {
  return (
    <Button 
      type="submit" 
      disabled={isDisabled}
      className="w-full bg-primary hover:bg-primary-dark"
    >
      {isProcessing ? "Processing..." : `Pay ${formatCurrency(total)}`}
    </Button>
  );
};