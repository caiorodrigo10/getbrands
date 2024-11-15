import { useEffect, useState } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ProfitProjectionsProps {
  product: Product;
  calculationValues?: {
    monthlySales: number;
    growthRate: number;
    costPrice: number;
    sellingPrice: number;
  };
}

interface MonthlyProjection {
  month: string;
  revenue: number;
  costs: number;
}

export const ProfitProjections = ({ product, calculationValues }: ProfitProjectionsProps) => {
  const [projections, setProjections] = useState<MonthlyProjection[]>([]);
  const [totalAnnualProfit, setTotalAnnualProfit] = useState(0);
  const [averageMonthlyProfit, setAverageMonthlyProfit] = useState(0);

  useEffect(() => {
    const calculateProjections = () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      let annualProfit = 0;
      const monthlyData = months.map((month, index) => {
        const growthFactor = Math.pow(1 + (calculationValues?.growthRate || 15) / 100, index);
        const baseSales = calculationValues?.monthlySales || 200;
        const monthlySales = baseSales * growthFactor;

        const revenue = monthlySales * product.srp;
        const costs = monthlySales * product.from_price;
        const monthlyProfit = revenue - costs;
        annualProfit += monthlyProfit;

        return {
          month,
          revenue: Number(revenue.toFixed(2)),
          costs: Number(costs.toFixed(2)),
        };
      });

      setTotalAnnualProfit(annualProfit);
      setAverageMonthlyProfit(annualProfit / 12);
      setProjections(monthlyData);
    };

    calculateProjections();
  }, [product, calculationValues]);

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
        <h2 className="text-xl font-semibold text-gray-900">12-Month Profit Projections</h2>
        
        <div className="h-[400px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={projections}
              margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="rgba(0,0,0,0.1)"
                vertical={false}
              />
              <XAxis 
                dataKey="month" 
                stroke="#666666"
              />
              <YAxis 
                stroke="#666666"
                tickFormatter={(value) => `${value / 1000}K`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#FFFFFF',
                  border: '1px solid #E5E7EB',
                  borderRadius: '8px',
                  color: '#111827'
                }}
                formatter={(value: number) => formatCurrency(value)}
              />
              <Legend 
                verticalAlign="top" 
                height={36}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                name="Revenue"
                stroke="#22C55E"
                fill="#22C55E"
                fillOpacity={0.2}
                strokeWidth={2}
              />
              <Area
                type="monotone"
                dataKey="costs"
                name="Costs"
                stroke="#4C1E6C"
                fill="#4C1E6C"
                fillOpacity={0.2}
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Average Monthly Profit</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(averageMonthlyProfit)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-lg font-medium mb-2">Projected Annual Profit</h3>
          <p className="text-2xl font-bold text-green-600">
            {formatCurrency(totalAnnualProfit)}
          </p>
        </Card>
      </div>
    </div>
  );
};
