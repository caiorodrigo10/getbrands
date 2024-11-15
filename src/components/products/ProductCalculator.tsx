import { Product } from "@/types/product";
import { ProfitCalculatorForm } from "@/components/profit-calculator/ProfitCalculatorForm";
import { ProfitProjections } from "@/components/profit-calculator/ProfitProjections";
import { useState } from "react";

interface ProductCalculatorProps {
  product: Product;
}

interface CalculationValues {
  monthlySales: number;
  growthRate: number;
  costPrice: number;
  sellingPrice: number;
}

export const ProductCalculator = ({ product }: ProductCalculatorProps) => {
  const [calculationValues, setCalculationValues] = useState<CalculationValues>({
    monthlySales: 200,
    growthRate: 15,
    costPrice: product.from_price,
    sellingPrice: product.srp,
  });

  const handleCalculate = (values: CalculationValues) => {
    setCalculationValues(values);
  };

  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Profit Calculator</h2>
      <div className="space-y-6">
        <ProfitCalculatorForm 
          product={product} 
          onCalculate={handleCalculate}
        />
        <ProfitProjections 
          product={product}
          calculationValues={calculationValues}
        />
      </div>
    </div>
  );
};