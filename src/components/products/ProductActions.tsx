import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";
import { InsufficientPointsDialog } from "./dialogs/InsufficientPointsDialog";
import { PermissionDeniedDialog } from "./dialogs/PermissionDeniedDialog";
import { useProductActions } from "./hooks/useProductActions";

interface ProductActionsProps {
  product: Product;
  onSelectProduct?: () => void;
}

export const ProductActions = ({ product, onSelectProduct }: ProductActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const {
    showProjectDialog,
    showInsufficientPointsDialog,
    showPermissionDeniedDialog,
    projects,
    setShowProjectDialog,
    setShowInsufficientPointsDialog,
    setShowPermissionDeniedDialog,
    handleProjectSelection,
    handleSelectProduct,
    handleScheduleCall
  } = useProductActions(product);

  const handleRequestSample = async () => {
    setIsLoading(true);
    try {
      await addItem(product);
      toast({
        title: "Success",
        description: "Product added to cart successfully.",
      });
    } catch (error) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 px-4 sm:px-0">
      <Button
        variant="outline"
        size="lg"
        className="w-full text-primary hover:text-primary border-2 border-primary hover:bg-primary/10 h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleRequestSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Request Sample"}
      </Button>
      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary-dark text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleSelectProduct}
      >
        Select Product
      </Button>

      {product && (
        <ProjectSelectionDialog
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          projects={projects}
          onConfirm={handleProjectSelection}
          product={product}
        />
      )}

      <InsufficientPointsDialog
        open={showInsufficientPointsDialog}
        onOpenChange={setShowInsufficientPointsDialog}
        onScheduleCall={handleScheduleCall}
      />

      <PermissionDeniedDialog
        open={showPermissionDeniedDialog}
        onOpenChange={setShowPermissionDeniedDialog}
      />
    </div>
  );
};

export default ProductActions;