import { Button } from "@/components/ui/button";
import { useProductActions } from "@/hooks/useProductActions";

interface ProductActionsProps {
  productId: string;
  onSelectProduct?: () => void;
  showNotification?: boolean;
}

export const ProductActions = ({ productId, onSelectProduct, showNotification = true }: ProductActionsProps) => {
  const { isLoading, handleRequestSample } = useProductActions(productId, showNotification);

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 px-4 sm:px-0">
      <Button 
        onClick={() => handleRequestSample()} 
        className="w-full" 
        disabled={isLoading}
      >
        {isLoading ? "Processando..." : "Solicitar Amostra"}
      </Button>
      {onSelectProduct && (
        <Button 
          onClick={onSelectProduct} 
          variant="outline" 
          className="w-full"
        >
          Selecionar Produto
        </Button>
      )}
    </div>
  );
};