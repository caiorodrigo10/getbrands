import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks/useProductActions";

interface ProductActionsProps {
  productId: string;
  onSelectProduct: () => void;
}

export const ProductActions = ({ productId, onSelectProduct }: ProductActionsProps) => {
  const { isLoading, handleRequestSample } = useProductActions(productId);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:gap-4 mt-6">
      <Button 
        variant="outline" 
        size="lg"
        className="w-full text-primary hover:text-primary border-2 border-primary hover:bg-primary/10 h-12 text-base font-medium rounded-full"
        onClick={handleRequestSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Request Sample"}
      </Button>
      <Button 
        size="lg"
        className="w-full bg-primary hover:bg-primary-dark text-white h-12 text-base font-medium rounded-full"
        onClick={onSelectProduct}
        disabled={isLoading}
      >
        Select Product
      </Button>
    </div>
  );
};

export default ProductActions;