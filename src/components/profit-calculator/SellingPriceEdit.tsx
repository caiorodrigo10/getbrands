import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface SellingPriceEditProps {
  projectProductId: string;
  currentPrice: number;
  onPriceUpdate: (newPrice: number) => void;
}

export const SellingPriceEdit = ({ projectProductId, currentPrice, onPriceUpdate }: SellingPriceEditProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(currentPrice);
  const { toast } = useToast();

  const handleSave = async () => {
    try {
      const { data, error } = await supabase
        .from('project_specific_products')
        .upsert({
          project_product_id: projectProductId,
          selling_price: price,
        })
        .select()
        .single();

      if (error) throw error;

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

  if (!isEditing) {
    return (
      <div className="flex items-center gap-2">
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
          <input
            type="text"
            value={currentPrice.toFixed(2)}
            disabled
            className="flex h-10 w-full rounded-md border border-input bg-gray-50 px-3 py-2 text-sm pl-9 cursor-not-allowed"
          />
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setIsEditing(true)}
          className="h-8 w-8 p-0"
        >
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
        <Input
          type="number"
          value={price}
          onChange={(e) => setPrice(Number(e.target.value))}
          className="pl-9"
        />
      </div>
      <Button
        variant="ghost"
        size="sm"
        onClick={handleSave}
        className="h-8 w-8 p-0 text-green-600"
      >
        <Check className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsEditing(false)}
        className="h-8 w-8 p-0 text-red-600"
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
};