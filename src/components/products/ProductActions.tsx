import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks/useProductActions";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

interface ProductActionsProps {
  productId: string;
  onSelectProduct: () => void;
}

export const ProductActions = ({ productId, onSelectProduct }: ProductActionsProps) => {
  const { isLoading, handleRequestSample } = useProductActions(productId);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleOrderSample = async () => {
    try {
      const success = await handleRequestSample();
      if (success) {
        // Use replace: true to prevent back navigation issues
        navigate("/checkout/confirmation", { replace: true });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again.",
      });
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 px-4 sm:px-0">
      <Button 
        size="lg"
        className="w-full bg-[#08af71] hover:bg-[#08af71]/90 text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleOrderSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Order Sample"}
      </Button>
      <Button 
        size="lg"
        className="w-full bg-primary hover:bg-primary-dark text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={onSelectProduct}
        disabled={isLoading}
      >
        Select Product
      </Button>
    </div>
  );
};

export default ProductActions;