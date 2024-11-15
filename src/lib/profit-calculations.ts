export interface MonthlyProjection {
  month: string;
  revenue: number;
  cost: number;
  profit: number;
}

interface CalculationInputs {
  monthlySales: number;
  costPrice: number;
  sellingPrice: number;
  growthRate: number;
}

export const calculateProjections = (inputs: CalculationInputs): MonthlyProjection[] => {
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  let currentSales = inputs.monthlySales;
  const projections: MonthlyProjection[] = [];

  for (let i = 0; i < 12; i++) {
    const revenue = currentSales * inputs.sellingPrice;
    const cost = currentSales * inputs.costPrice;
    const profit = revenue - cost;

    projections.push({
      month: months[i],
      revenue,
      cost,
      profit,
    });

    // Apply monthly growth rate
    currentSales *= (1 + inputs.growthRate / 100);
  }

  return projections;
};