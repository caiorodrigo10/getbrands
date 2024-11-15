import { Card } from "@/components/ui/card";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from "recharts";
import { formatCurrency } from "@/lib/utils";

const data = [
  { month: "Jan", revenue: 45000 },
  { month: "Feb", revenue: 52000 },
  { month: "Mar", revenue: 48000 },
  { month: "Apr", revenue: 61000 },
  { month: "May", revenue: 55000 },
  { month: "Jun", revenue: 67000 },
  { month: "Jul", revenue: 72000 },
  { month: "Aug", revenue: 69000 },
  { month: "Sep", revenue: 78000 },
  { month: "Oct", revenue: 82000 },
  { month: "Nov", revenue: 85000 },
  { month: "Dec", revenue: 91000 },
];

const MonthlyRevenue = () => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-medium mb-4">Monthly Revenue</h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4c1e6c" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#4c1e6c" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis tickFormatter={(value) => `$${value/1000}k`} />
            <Tooltip formatter={(value) => formatCurrency(value as number)} />
            <Area
              type="monotone"
              dataKey="revenue"
              stroke="#4c1e6c"
              fillOpacity={1}
              fill="url(#colorRevenue)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};

export default MonthlyRevenue;