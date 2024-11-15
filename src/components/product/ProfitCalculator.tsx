import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ProfitCalculatorProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
}

interface CalculationResult {
  monthlyRevenue: number;
  monthlyCosts: number;
  monthlyProfit: number;
  annualRevenue: number;
  annualCosts: number;
  annualProfit: number;
  profitMargin: number;
}

const ProfitCalculator = ({ product, isOpen, onClose }: ProfitCalculatorProps) => {
  const [monthlySales, setMonthlySales] = useState(100);
  const [costPrice, setCostPrice] = useState(product.from_price);
  const [sellingPrice, setSellingPrice] = useState(product.srp);
  const [results, setResults] = useState<CalculationResult | null>(null);

  const calculateProjections = () => {
    const monthlyRevenue = monthlySales * sellingPrice;
    const monthlyCosts = monthlySales * costPrice;
    const monthlyProfit = monthlyRevenue - monthlyCosts;
    const profitMargin = (monthlyProfit / monthlyRevenue) * 100;

    setResults({
      monthlyRevenue,
      monthlyCosts,
      monthlyProfit,
      annualRevenue: monthlyRevenue * 12,
      annualCosts: monthlyCosts * 12,
      annualProfit: monthlyProfit * 12,
      profitMargin,
    });
  };

  useEffect(() => {
    calculateProjections();
  }, [monthlySales, costPrice, sellingPrice]);

  const resetToDefaults = () => {
    setMonthlySales(100);
    setCostPrice(product.from_price);
    setSellingPrice(product.srp);
  };

  const generateChartData = () => {
    if (!results) return [];

    return Array.from({ length: 12 }, (_, i) => ({
      month: `Month ${i + 1}`,
      revenue: results.monthlyRevenue,
      costs: results.monthlyCosts,
      profit: results.monthlyProfit,
    }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            Profit Calculator - {product.name}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Monthly Sales Estimate
                </label>
                <Input
                  type="number"
                  min="1"
                  value={monthlySales}
                  onChange={(e) => setMonthlySales(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Cost Price (per unit)
                </label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700">
                  Selling Price (per unit)
                </label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="mt-1"
                />
              </div>

              <Button onClick={resetToDefaults} variant="outline" className="w-full">
                Reset to Defaults
              </Button>
            </div>

            {results && (
              <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-lg">Monthly Projections</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-semibold">{formatCurrency(results.monthlyRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Costs</p>
                    <p className="font-semibold">{formatCurrency(results.monthlyCosts)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="font-semibold text-green-600">{formatCurrency(results.monthlyProfit)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Margin</p>
                    <p className="font-semibold">{results.profitMargin.toFixed(1)}%</p>
                  </div>
                </div>

                <h3 className="font-semibold text-lg pt-4">Annual Projections</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Revenue</p>
                    <p className="font-semibold">{formatCurrency(results.annualRevenue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Costs</p>
                    <p className="font-semibold">{formatCurrency(results.annualCosts)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Profit</p>
                    <p className="font-semibold text-green-600">{formatCurrency(results.annualProfit)}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line type="monotone" dataKey="revenue" stroke="#4c1e6c" name="Revenue" />
                <Line type="monotone" dataKey="costs" stroke="#ef4444" name="Costs" />
                <Line type="monotone" dataKey="profit" stroke="#22c55e" name="Profit" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfitCalculator;