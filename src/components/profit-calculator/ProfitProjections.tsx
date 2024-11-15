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
  profit: number;
}

export const ProfitProjections = ({ product }: ProfitProjectionsProps) => {
  const [projections, setProjections] = useState<MonthlyProjection[]>([]);

  useEffect(() => {
    const calculateProjections = () => {
      const months = [
        "Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
      ];

      const monthlyData = months.map((month, index) => {
        const growthFactor = Math.pow(1.15, index); // 15% monthly growth
        const baseSales = 100; // Example base sales
        const monthlySales = baseSales * growthFactor;

        const revenue = monthlySales * product.srp;
        const costs = monthlySales * product.from_price;
        const profit = revenue - costs;

        return {
          month,
          revenue: Number(revenue.toFixed(2)),
          costs: Number(costs.toFixed(2)),
          profit: Number(profit.toFixed(2)),
        };
      });

      setProjections(monthlyData);
    };

    calculateProjections();
  }, [product]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border space-y-6">
      <h2 className="text-lg font-semibold">12-Month Projections</h2>
      
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={projections}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              formatter={(value: number) => formatCurrency(value)}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="revenue"
              stroke="#4c1e6c"
              name="Revenue"
            />
            <Line
              type="monotone"
              dataKey="costs"
              stroke="#666666"
              name="Costs"
            />
            <Line
              type="monotone"
              dataKey="profit"
              stroke="#6a2b97"
              name="Profit"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-2">Month</th>
              <th className="text-right py-2">Revenue</th>
              <th className="text-right py-2">Costs</th>
              <th className="text-right py-2">Profit</th>
            </tr>
          </thead>
          <tbody>
            {projections.map((projection) => (
              <tr key={projection.month} className="border-b">
                <td className="py-2">{projection.month}</td>
                <td className="text-right py-2">
                  {formatCurrency(projection.revenue)}
                </td>
                <td className="text-right py-2">
                  {formatCurrency(projection.costs)}
                </td>
                <td className="text-right py-2">
                  {formatCurrency(projection.profit)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};