import { useState } from "react";
import { Product } from "@/types/product";
import { ProfitCalculatorForm } from "@/components/profit-calculator/ProfitCalculatorForm";
import { ProfitProjections } from "@/components/profit-calculator/ProfitProjections";
import { Card } from "@/components/ui/card";
import { trackProfitCalculation } from "@/lib/analytics/events/profit-calculator";

interface ProductCalculatorProps {
  product: Product;
}

export const ProductCalculator = ({ product }: ProductCalculatorProps) => {
  const [calculationValues, setCalculationValues] = useState({
    monthlySales: 200,
    growthRate: 15,
    costPrice: product.from_price,
    sellingPrice: product.srp,
  });

  const handleCalculate = (values: typeof calculationValues) => {
    setCalculationValues(values);
    
    trackProfitCalculation({
      productId: product.id,
      productName: product.name,
      ...values,
      projectedAnnualProfit: calculateAnnualProfit(values),
      averageMonthlyProfit: calculateMonthlyProfit(values)
    });
  };

  const calculateAnnualProfit = (values: typeof calculationValues) => {
    let totalProfit = 0;
    let currentSales = values.monthlySales;
    
    for (let month = 0; month < 12; month++) {
      const monthlyRevenue = currentSales * values.sellingPrice;
      const monthlyCost = currentSales * values.costPrice;
      const monthlyProfit = monthlyRevenue - monthlyCost;
      totalProfit += monthlyProfit;
      
      // Aplica a taxa de crescimento mensal
      currentSales *= (1 + values.growthRate / 100);
    }
    
    return totalProfit;
  };

  const calculateMonthlyProfit = (values: typeof calculationValues) => {
    return calculateAnnualProfit(values) / 12;
  };

  return (
    <div className="space-y-8">
      <Card className="bg-white p-6">
        <div className="flex items-center gap-6">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              {product.name}
            </h2>
            <p className="text-gray-500">
              Category: {product.category}
            </p>
          </div>
        </div>
      </Card>
      
      <ProfitCalculatorForm 
        product={product} 
        onCalculate={handleCalculate}
      />
      
      <ProfitProjections 
        product={product}
        calculationValues={calculationValues}
      />
    </div>
  );
};

export default ProductCalculator;