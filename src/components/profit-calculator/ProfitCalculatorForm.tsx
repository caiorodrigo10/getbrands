import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

interface ProfitCalculatorFormProps {
  product: Product;
}

export const ProfitCalculatorForm = ({ product }: ProfitCalculatorFormProps) => {
  const [monthlySales, setMonthlySales] = useState("0");
  const [costPrice, setCostPrice] = useState(product.from_price.toString());
  const [sellingPrice, setSellingPrice] = useState(product.srp.toString());
  const [growthRate, setGrowthRate] = useState("15");
  const { toast } = useToast();

  const handleReset = () => {
    setCostPrice(product.from_price.toString());
    setSellingPrice(product.srp.toString());
    setGrowthRate("15");
    setMonthlySales("0");
    toast({
      title: "Values Reset",
      description: "All values have been reset to their defaults.",
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm border">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Calculation Settings</h2>
        <Button variant="outline" onClick={handleReset}>
          Reset to Defaults
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthlySales">Monthly Sales Volume</Label>
          <Input
            id="monthlySales"
            type="number"
            min="0"
            value={monthlySales}
            onChange={(e) => setMonthlySales(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
          <Input
            id="growthRate"
            type="number"
            min="0"
            max="100"
            value={growthRate}
            onChange={(e) => setGrowthRate(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price</Label>
          <Input
            id="costPrice"
            type="number"
            min="0"
            step="0.01"
            value={costPrice}
            onChange={(e) => setCostPrice(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price</Label>
          <Input
            id="sellingPrice"
            type="number"
            min="0"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
          />
        </div>
      </div>
    </div>
  );
};