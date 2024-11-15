import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProductPricingProps {
  projectProductId: string;
  costPrice: number;
  suggestedPrice: number;
  currentSellingPrice?: number;
  onPriceUpdate: (newPrice: number) => void;
}

export const ProductPricing = ({
  projectProductId,
  costPrice,
  suggestedPrice,
  currentSellingPrice,
  onPriceUpdate,
}: ProductPricingProps) => {
  const [sellingPrice, setSellingPrice] = useState(currentSellingPrice || suggestedPrice);
  const { toast } = useToast();
  const profit = sellingPrice - costPrice;

  const handlePriceChange = async (newPrice: string) => {
    const price = parseFloat(newPrice);
    if (isNaN(price)) return;
    
    setSellingPrice(price);
    try {
      const { error } = await supabase
        .from('project_specific_products')
        .upsert({
          project_product_id: projectProductId,
          selling_price: price,
        });

      if (error) throw error;

      onPriceUpdate(price);
      toast({
        title: "Success",
        description: "Selling price updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update selling price",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Cost Price</Label>
          <Input
            type="number"
            value={costPrice.toFixed(2)}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <Label>Suggested Price</Label>
          <Input
            type="number"
            value={suggestedPrice.toFixed(2)}
            disabled
            className="bg-gray-50"
          />
        </div>
        <div>
          <Label>Your Selling Price</Label>
          <Input
            type="number"
            value={sellingPrice}
            onChange={(e) => handlePriceChange(e.target.value)}
            min={0}
            step="0.01"
          />
        </div>
        <div>
          <Label>Profit</Label>
          <div className={`p-2 rounded-md font-semibold ${profit >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            ${profit.toFixed(2)}
          </div>
        </div>
      </div>
    </div>
  );
};