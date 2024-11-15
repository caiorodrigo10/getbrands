import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import { Slider } from "@/components/ui/slider";
import { DollarSign } from "lucide-react";

interface ProfitCalculatorFormProps {
  product: Product | null;
  onCalculate: (values: {
    monthlySales: number;
    growthRate: number;
    costPrice: number;
    sellingPrice: number;
  }) => void;
}

export const ProfitCalculatorForm = ({ product, onCalculate }: ProfitCalculatorFormProps) => {
  const [monthlySales, setMonthlySales] = useState(200);
  const [growthRate, setGrowthRate] = useState(15);
  const [sellingPrice, setSellingPrice] = useState(product?.srp || 0);
  const costPrice = product?.from_price || 0;
  const { toast } = useToast();

  const handleReset = () => {
    setMonthlySales(200);
    setGrowthRate(15);
    setSellingPrice(product?.srp || 0);
    toast({
      title: "Values Reset",
      description: "All values have been reset to their defaults.",
    });
  };

  const handleCalculate = () => {
    onCalculate({
      monthlySales,
      growthRate,
      costPrice,
      sellingPrice,
    });
    
    // Smooth scroll to the chart section
    const chartElement = document.querySelector('.profit-projections-chart');
    if (chartElement) {
      chartElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Calculation Settings</h2>
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="monthlySales">Monthly Sales Volume</Label>
            <div className="pt-2">
              <Slider
                id="monthlySales"
                min={0}
                max={1000}
                step={1}
                value={[monthlySales]}
                onValueChange={(value) => setMonthlySales(value[0])}
                className="w-full"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current value: {monthlySales} units
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
            <div className="pt-2">
              <Slider
                id="growthRate"
                min={0}
                max={100}
                step={1}
                value={[growthRate]}
                onValueChange={(value) => setGrowthRate(value[0])}
                className="w-full"
              />
            </div>
            <p className="text-sm text-muted-foreground mt-1">
              Current value: {growthRate}%
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="costPrice">Cost Price</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <DollarSign className="h-4 w-4 text-gray-500" />
              </div>
              <input
                id="costPrice"
                type="text"
                value={`${costPrice.toFixed(2)}`}
                disabled
                className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm pl-9 cursor-not-allowed"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="sellingPrice">Selling Price</Label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2">
                <DollarSign className="h-4 w-4 text-green-600" />
              </div>
              <input
                id="sellingPrice"
                type="number"
                value={sellingPrice}
                onChange={(e) => setSellingPrice(Number(e.target.value))}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm pl-9 font-bold text-green-600"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-center">
          <Button 
            className="w-auto mt-4" 
            size="default"
            onClick={handleCalculate}
          >
            Calculate Profit Projections
          </Button>
        </div>
      </div>
    </div>
  );
};