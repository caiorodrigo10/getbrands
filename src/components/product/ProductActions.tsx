import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks/useProductActions";

interface ProductActionsProps {
  productId: string;
  onSelectProduct: () => void;
}

export const ProductActions = ({ productId, onSelectProduct }: ProductActionsProps) => {
  const { isLoading, handleRequestSample } = useProductActions(productId);

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        variant="outline" 
        className="flex-1 text-primary hover:text-primary border-primary hover:bg-primary/10"
        onClick={handleRequestSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Request Sample"}
      </Button>
      <Button 
        className="flex-1 bg-primary hover:bg-primary-dark text-white"
        onClick={onSelectProduct}
        disabled={isLoading}
      >
        Select Product
      </Button>
    </div>
  );
};

export default ProductActions;