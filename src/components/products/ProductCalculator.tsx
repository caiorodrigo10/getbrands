import { useState } from "react";
import { Product } from "@/types/product";
import { trackProductCalculatorUsage } from "@/lib/analytics/events/products";

interface ProductCalculatorProps {
  product: Product;
}

export const ProductCalculator = ({ product }: ProductCalculatorProps) => {
  const [sellingPrice, setSellingPrice] = useState(product.srp);
  const [quantity, setQuantity] = useState(1);

  const profit = (sellingPrice - product.from_price) * quantity;

  const handleCalculate = () => {
    trackProductCalculatorUsage(product, {
      sellingPrice,
      profit,
      quantity
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Product Calculator</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium">Selling Price</label>
          <input
            type="number"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(parseFloat(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value))}
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
          />
        </div>
      </div>
      <div className="flex justify-between text-lg font-semibold">
        <span>Profit:</span>
        <span>${profit.toFixed(2)}</span>
      </div>
      <button
        onClick={handleCalculate}
        className="mt-4 w-full py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
      >
        Calculate
      </button>
    </div>
  );
};

export default ProductCalculator;
