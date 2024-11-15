import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { PencilIcon, CheckIcon, XIcon } from "lucide-react";

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
  const [isEditing, setIsEditing] = useState(false);
  const [tempPrice, setTempPrice] = useState(sellingPrice.toString());
  const { toast } = useToast();
  const profit = sellingPrice - costPrice;

  const handlePriceChange = async () => {
    const price = parseFloat(tempPrice);
    if (isNaN(price)) {
      toast({
        title: "Error",
        description: "Please enter a valid price",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase
        .from('project_specific_products')
        .upsert({
          project_product_id: projectProductId,
          selling_price: price,
        });

      if (error) throw error;

      setSellingPrice(price);
      onPriceUpdate(price);
      setIsEditing(false);
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

  const cancelEdit = () => {
    setTempPrice(sellingPrice.toString());
    setIsEditing(false);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Your Selling Price</Label>
            {!isEditing ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 px-2"
              >
                <PencilIcon className="h-4 w-4" />
              </Button>
            ) : (
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePriceChange}
                  className="h-8 px-2"
                >
                  <CheckIcon className="h-4 w-4 text-green-600" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={cancelEdit}
                  className="h-8 px-2"
                >
                  <XIcon className="h-4 w-4 text-red-600" />
                </Button>
              </div>
            )}
          </div>
          {isEditing ? (
            <Input
              type="number"
              value={tempPrice}
              onChange={(e) => setTempPrice(e.target.value)}
              min={0}
              step="0.01"
            />
          ) : (
            <div className="p-2 border rounded-md">
              ${sellingPrice.toFixed(2)}
            </div>
          )}
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