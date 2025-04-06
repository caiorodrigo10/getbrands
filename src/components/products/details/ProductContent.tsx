
import { Product, ProductImage } from "@/types/product";
import { ProductHeader } from "../ProductHeader";
import { ProductBenefits } from "../ProductBenefits";
import { ProductCalculator } from "../ProductCalculator";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";
import { useEffect } from "react";

interface ProductContentProps {
  product: Product;
  showProjectDialog: boolean;
  setShowProjectDialog: (show: boolean) => void;
  handleProjectSelection: (projectId: string) => Promise<void>;
  handleSelectProduct: () => void;
  projects: any[];
}

export const ProductContent = ({
  product,
  showProjectDialog,
  setShowProjectDialog,
  handleProjectSelection,
  handleSelectProduct,
  projects
}: ProductContentProps) => {
  
  // Add a debug log to track product data
  useEffect(() => {
    console.log("ProductContent rendering with product:", {
      id: product.id,
      name: product.name
    });
  }, [product]);

  return (
    <>
      <ProductHeader 
        product={product} 
        onSelectProduct={handleSelectProduct}
      />
      
      <div className="mt-16">
        <ProductBenefits product={product} />
      </div>

      <div className="mt-16">
        <ProductCalculator product={product} />
      </div>

      {product && (
        <ProjectSelectionDialog 
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          projects={projects}
          onConfirm={handleProjectSelection}
          product={product}
        />
      )}
    </>
  );
};
