import { useState } from "react";
import { ProductSearch } from "@/components/ProductSearch";
import { ProfitCalculatorForm } from "@/components/profit-calculator/ProfitCalculatorForm";
import { ProfitProjections } from "@/components/profit-calculator/ProfitProjections";
import { Product } from "@/types/product";
import { Card } from "@/components/ui/card";

interface CalculationValues {
  monthlySales: number;
  growthRate: number;
  costPrice: number;
  sellingPrice: number;
}

const ProfitCalculator = () => {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [calculationValues, setCalculationValues] = useState<CalculationValues>({
    monthlySales: 200,
    growthRate: 15,
    costPrice: 0,
    sellingPrice: 0,
  });

  const handleProductSelect = (product: Product) => {
    setSelectedProduct(product);
    setCalculationValues(prev => ({
      ...prev,
      costPrice: product.from_price,
      sellingPrice: product.srp,
    }));
  };

  const handleCalculate = (values: CalculationValues) => {
    setCalculationValues(values);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Profit Calculator</h1>
      </div>

      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h2 className="text-lg font-semibold mb-4">Select a Product</h2>
          <ProductSearch 
            onSelectProduct={handleProductSelect}
            addToCart={false}
          />
        </div>

        {selectedProduct && (
          <Card className="bg-white p-6">
            <div className="flex items-center gap-6">
              <img
                src={selectedProduct.image_url || "/placeholder.svg"}
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">
                  {selectedProduct.name}
                </h2>
                <p className="text-gray-500">
                  Category: {selectedProduct.category}
                </p>
              </div>
            </div>
          </Card>
        )}
        
        <ProfitCalculatorForm 
          product={selectedProduct} 
          onCalculate={handleCalculate}
        />
        
        <ProfitProjections 
          product={selectedProduct}
          calculationValues={calculationValues}
        />
      </div>
    </div>
  );
};

export default ProfitCalculator;