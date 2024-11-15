import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";
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
import { MonthlyProjection } from "@/lib/profit-calculations";

interface ProfitProjectionsProps {
  projections: MonthlyProjection[];
}

export const ProfitProjections = ({ projections }: ProfitProjectionsProps) => {
  const totalRevenue = projections.reduce((sum, p) => sum + p.revenue, 0);
  const totalCost = projections.reduce((sum, p) => sum + p.cost, 0);
  const totalProfit = projections.reduce((sum, p) => sum + p.profit, 0);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Revenue
          </h3>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(totalRevenue)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Cost
          </h3>
          <p className="mt-2 text-2xl font-bold">
            {formatCurrency(totalCost)}
          </p>
        </Card>
        <Card className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground">
            Total Profit
          </h3>
          <p className="mt-2 text-2xl font-bold text-green-600">
            {formatCurrency(totalProfit)}
          </p>
        </Card>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">12-Month Projection</h3>
        <div className="h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={projections}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#2563eb"
                name="Revenue"
              />
              <Line
                type="monotone"
                dataKey="cost"
                stroke="#dc2626"
                name="Cost"
              />
              <Line
                type="monotone"
                dataKey="profit"
                stroke="#16a34a"
                name="Profit"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Revenue</TableHead>
              <TableHead className="text-right">Cost</TableHead>
              <TableHead className="text-right">Profit</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {projections.map((projection) => (
              <TableRow key={projection.month}>
                <TableCell>{projection.month}</TableCell>
                <TableCell className="text-right">
                  {formatCurrency(projection.revenue)}
                </TableCell>
                <TableCell className="text-right">
                  {formatCurrency(projection.cost)}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {formatCurrency(projection.profit)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};