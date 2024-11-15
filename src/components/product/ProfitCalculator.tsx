import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { X, HelpCircle, TrendingUp, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  Tooltip as UITooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  const [monthlyGrowth, setMonthlyGrowth] = useState(0);
  const [results, setResults] = useState<CalculationResult | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const { toast } = useToast();

  const calculateProjections = () => {
    const monthlyRevenue = monthlySales * sellingPrice;
    const monthlyCosts = monthlySales * costPrice;
    const monthlyProfit = monthlyRevenue - monthlyCosts;
    const profitMargin = (monthlyProfit / monthlyRevenue) * 100;

    setResults({
      monthlyRevenue,
      monthlyCosts,
      monthlyProfit,
      annualRevenue: monthlyRevenue * 12 * (1 + monthlyGrowth / 100),
      annualCosts: monthlyCosts * 12 * (1 + monthlyGrowth / 100),
      annualProfit: monthlyProfit * 12 * (1 + monthlyGrowth / 100),
      profitMargin,
    });
  };

  useEffect(() => {
    calculateProjections();
  }, [monthlySales, costPrice, sellingPrice, monthlyGrowth]);

  const resetToDefaults = () => {
    setMonthlySales(100);
    setCostPrice(product.from_price);
    setSellingPrice(product.srp);
    setMonthlyGrowth(0);
  };

  const handleConfirmProjections = () => {
    setShowSuccess(true);
    toast({
      title: "Success!",
      description: "Your projections have been saved successfully.",
    });
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1500);
  };

  const generateChartData = () => {
    if (!results) return [];

    return Array.from({ length: 12 }, (_, i) => {
      const growthFactor = 1 + (monthlyGrowth * (i + 1)) / 100;
      return {
        month: `Month ${i + 1}`,
        revenue: results.monthlyRevenue * growthFactor,
        costs: results.monthlyCosts * growthFactor,
        profit: results.monthlyProfit * growthFactor,
      };
    });
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
        <DialogHeader className="relative">
          <DialogTitle className="text-2xl font-bold mb-6">
            Profit Calculator - {product.name}
          </DialogTitle>
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Monthly Sales Estimate
                </label>
                <Input
                  type="number"
                  min="1"
                  value={monthlySales}
                  onChange={(e) => setMonthlySales(Number(e.target.value))}
                  className="w-full rounded-lg shadow-sm"
                  placeholder="Enter estimated monthly sales"
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Cost Price (per unit)
                </label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={costPrice}
                  onChange={(e) => setCostPrice(Number(e.target.value))}
                  className="w-full rounded-lg shadow-sm"
                  placeholder="Enter cost price"
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 block">
                  Selling Price (per unit)
                </label>
                <Input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={sellingPrice}
                  onChange={(e) => setSellingPrice(Number(e.target.value))}
                  className="w-full rounded-lg shadow-sm"
                  placeholder="Enter selling price"
                />
              </div>

              <div className="relative">
                <label className="text-sm font-medium text-gray-700 mb-1 flex items-center gap-2">
                  Monthly Growth Rate (%)
                  <TooltipProvider>
                    <UITooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the expected monthly growth rate as a percentage.</p>
                        <p>This will affect future month projections.</p>
                      </TooltipContent>
                    </UITooltip>
                  </TooltipProvider>
                </label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={monthlyGrowth}
                  onChange={(e) => setMonthlyGrowth(Number(e.target.value))}
                  className="w-full rounded-lg shadow-sm"
                  placeholder="Enter growth rate %"
                />
              </div>

              <Button onClick={resetToDefaults} variant="outline" className="w-full">
                Reset to Defaults
              </Button>
            </div>

            {results && (
              <div className="space-y-6">
                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
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
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">Profit</p>
                      {monthlyGrowth > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                      <p className="font-semibold text-green-600">
                        {formatCurrency(results.monthlyProfit)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Margin</p>
                      <p className="font-semibold">{results.profitMargin.toFixed(1)}%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg space-y-4">
                  <h3 className="font-semibold text-lg">Annual Projections</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-600">Revenue</p>
                      <p className="font-semibold">{formatCurrency(results.annualRevenue)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Costs</p>
                      <p className="font-semibold">{formatCurrency(results.annualCosts)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-gray-600">Profit</p>
                      {monthlyGrowth > 0 && <TrendingUp className="h-4 w-4 text-green-500" />}
                      <p className="font-semibold text-green-600">
                        {formatCurrency(results.annualProfit)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <Button 
              onClick={handleConfirmProjections}
              className="w-full bg-primary hover:bg-primary-dark"
            >
              {showSuccess ? (
                <span className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  Projections Saved!
                </span>
              ) : (
                'Confirm Projections'
              )}
            </Button>
          </div>

          <div className="h-[500px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={generateChartData()} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="month"
                  label={{ value: 'Months', position: 'bottom', offset: 0 }}
                />
                <YAxis 
                  label={{ 
                    value: 'Revenue/Costs/Profit ($)', 
                    angle: -90, 
                    position: 'insideLeft',
                    offset: 10
                  }}
                />
                <Tooltip formatter={(value) => formatCurrency(Number(value))} />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="revenue" 
                  stroke="#4c1e6c" 
                  name="Revenue"
                  animationDuration={500}
                />
                <Line 
                  type="monotone" 
                  dataKey="costs" 
                  stroke="#ef4444" 
                  name="Costs"
                  animationDuration={500}
                />
                <Line 
                  type="monotone" 
                  dataKey="profit" 
                  stroke="#22c55e" 
                  name="Profit"
                  animationDuration={500}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProfitCalculator;