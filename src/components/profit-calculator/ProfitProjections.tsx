import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface ProfitProjectionsProps {
  product: Product;
}

interface MonthlyProjection {
  month: string;
  revenue: number;
  costs: number;
}

export const ProfitProjections = ({ product }: ProfitProjectionsProps) => {
  const [projections, setProjections] = useState<MonthlyProjection[]>([]);

  useEffect(() => {
    const calculateProjections = () => {
      const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez"
      ];

      const monthlyData = months.map((month, index) => {
        const growthFactor = Math.pow(1.15, index); // 15% monthly growth
        const baseSales = 100; // Example base sales
        const monthlySales = baseSales * growthFactor;

        const revenue = monthlySales * product.srp;
        const costs = monthlySales * product.from_price;

        return {
          month,
          revenue: Number(revenue.toFixed(2)),
          costs: Number(costs.toFixed(2)),
        };
      });

      setProjections(monthlyData);
    };

    calculateProjections();
  }, [product]);

  return (
    <div className="bg-[#0A0A0A] p-6 rounded-lg shadow-sm border border-gray-800 space-y-6">
      <h2 className="text-xl font-semibold text-white">Tendência de Lucratividade Mensal</h2>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={projections}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="rgba(255,255,255,0.1)"
              vertical={false}
            />
            <XAxis 
              dataKey="month" 
              stroke="#666666"
              tick={{ fill: '#666666' }}
            />
            <YAxis 
              stroke="#666666"
              tick={{ fill: '#666666' }}
              tickFormatter={(value) => `${value / 1000}K`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: '#1A1A1A',
                border: '1px solid #333333',
                borderRadius: '8px',
                color: '#FFFFFF'
              }}
              formatter={(value: number) => formatCurrency(value)}
              labelStyle={{ color: '#FFFFFF' }}
            />
            <Legend 
              verticalAlign="top" 
              height={36}
              wrapperStyle={{ color: '#FFFFFF' }}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#22C55E"
              strokeWidth={2}
              name="Faturamento"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="costs"
              stroke="#4C1E6C"
              strokeWidth={2}
              name="Custos"
              dot={false}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};