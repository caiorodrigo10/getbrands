import { useState } from "react";
import { Label } from "@/components/ui/label";
import { SellingPriceEdit } from "@/components/profit-calculator/SellingPriceEdit";

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
  const profit = sellingPrice - costPrice;

  const handlePriceUpdate = (newPrice: number) => {
    setSellingPrice(newPrice);
    onPriceUpdate(newPrice);
  };

  return (
    <div className="space-y-4 mt-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label>Your Selling Price</Label>
          <SellingPriceEdit
            projectProductId={projectProductId}
            currentPrice={sellingPrice}
            onPriceUpdate={handlePriceUpdate}
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