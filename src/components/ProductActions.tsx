import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks/useProductActions";

interface ProductActionsProps {
  productId: string;
  onSelectProduct: () => void;
  showNotification?: boolean;
}

export const ProductActions = ({ productId, onSelectProduct, showNotification = true }: ProductActionsProps) => {
  const { isLoading, handleRequestSample } = useProductActions(productId, showNotification);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 px-4 sm:px-0">
      <Button 
        size="lg"
        className="w-full bg-[#0ecf88] hover:bg-[#0ecf88]/90 text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleRequestSample}
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