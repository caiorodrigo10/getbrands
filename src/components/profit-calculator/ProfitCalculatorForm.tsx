import { useState } from "react";
import { Product } from "@/types/product";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { ProfitProjections } from "./ProfitProjections";
import { calculateProjections } from "@/lib/profit-calculations";

interface ProfitCalculatorFormProps {
  product: Product;
}

export const ProfitCalculatorForm = ({ product }: ProfitCalculatorFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    monthlySales: 100,
    costPrice: product.from_price,
    sellingPrice: product.srp,
    growthRate: 15,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const numValue = parseFloat(value);
    
    if (isNaN(numValue) || numValue < 0) {
      toast({
        variant: "destructive",
        title: "Invalid input",
        description: "Please enter a valid positive number",
      });
      return;
    }

    setFormData(prev => ({
      ...prev,
      [name]: numValue
    }));
  };

  const handleReset = () => {
    setFormData({
      monthlySales: 100,
      costPrice: product.from_price,
      sellingPrice: product.srp,
      growthRate: 15,
    });
    toast({
      title: "Reset successful",
      description: "All values have been reset to defaults",
    });
  };

  const projections = calculateProjections(formData);

  return (
    <div className="space-y-8">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="monthlySales">Monthly Sales Volume</Label>
          <Input
            id="monthlySales"
            name="monthlySales"
            type="number"
            value={formData.monthlySales}
            onChange={handleInputChange}
            min="0"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="growthRate">Monthly Growth Rate (%)</Label>
          <Input
            id="growthRate"
            name="growthRate"
            type="number"
            value={formData.growthRate}
            onChange={handleInputChange}
            min="0"
            max="100"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="costPrice">Cost Price ($)</Label>
          <Input
            id="costPrice"
            name="costPrice"
            type="number"
            value={formData.costPrice}
            onChange={handleInputChange}
            min="0"
            step="0.01"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="sellingPrice">Selling Price ($)</Label>
          <Input
            id="sellingPrice"
            name="sellingPrice"
            type="number"
            value={formData.sellingPrice}
            onChange={handleInputChange}
            min="0"
            step="0.01"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <Button 
          variant="outline" 
          onClick={handleReset}
          className="w-full md:w-auto"
        >
          Reset to Defaults
        </Button>
      </div>

      <ProfitProjections projections={projections} />
    </div>
  );
};