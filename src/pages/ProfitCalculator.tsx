import { useState } from "react";
import { ProductSearch } from "@/components/ProductSearch";
import { Product } from "@/types/product";
import { ProfitCalculatorForm } from "@/components/profit-calculator/ProfitCalculatorForm";
import { ProfitProjections } from "@/components/profit-calculator/ProfitProjections";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const ProfitCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Profit Calculator</h1>
          <p className="text-muted-foreground mt-2">
            Calculate potential profits based on your sales projections
          </p>
        </div>
        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
          <X className="h-5 w-5" />
        </Button>
      </div>

      <div className="space-y-8">
        {!selectedProduct ? (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold">Select a Product</h2>
            <ProductSearch onSelectProduct={setSelectedProduct} />
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold">{selectedProduct.name}</h2>
                <p className="text-muted-foreground">
                  Base price: ${selectedProduct.from_price.toFixed(2)} | SRP: $
                  {selectedProduct.srp.toFixed(2)}
                </p>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedProduct(null)}
              >
                Change Product
              </Button>
            </div>
            <ProfitCalculatorForm product={selectedProduct} />
          </>
        )}
      </div>
    </div>
  );
};

export default ProfitCalculator;