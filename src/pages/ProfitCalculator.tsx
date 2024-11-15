import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { ProductSearch } from "@/components/ProductSearch";
import { ProfitCalculatorForm } from "@/components/profit-calculator/ProfitCalculatorForm";
import { ProfitProjections } from "@/components/profit-calculator/ProfitProjections";
import { Product } from "@/types/product";

const ProfitCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { toast } = useToast();

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    toast({
      title: "Product Selected",
      description: `${product.name} has been selected for calculation.`,
    });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profit Calculator</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Select a Product</h2>
          <ProductSearch onSelectProduct={handleProductSelect} />
        </div>

        {selectedProduct && (
          <>
            <ProfitCalculatorForm product={selectedProduct} />
            <ProfitProjections product={selectedProduct} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitCalculator;