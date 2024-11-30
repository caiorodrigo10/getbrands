import { trackEvent } from "../index";

interface ProfitCalculationEvent {
  productId?: string;
  productName?: string;
  monthlySales: number;
  growthRate: number;
  costPrice: number;
  sellingPrice: number;
  projectedAnnualProfit: number;
  averageMonthlyProfit: number;
}

export const trackProfitCalculation = (data: ProfitCalculationEvent) => {
  trackEvent("Profit Calculation Performed", {
    ...data,
    timestamp: new Date().toISOString()
  });
};

export const trackProfitCalculatorProductSelect = (productId: string, productName: string) => {
  trackEvent("Profit Calculator Product Selected", {
    productId,
    productName,
    timestamp: new Date().toISOString()
  });
};