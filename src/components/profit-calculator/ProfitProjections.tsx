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
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h2 className="text-xl font-semibold text-gray-900">Tendência de Lucratividade Mensal</h2>
      
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
              name="Faturamento"
              stroke="#22C55E"
              fill="#22C55E"
              fillOpacity={0.2}
              strokeWidth={2}
            />
            <Area
              type="monotone"
              dataKey="costs"
              name="Custos"
              stroke="#4C1E6C"
              fill="#4C1E6C"
              fillOpacity={0.2}
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};