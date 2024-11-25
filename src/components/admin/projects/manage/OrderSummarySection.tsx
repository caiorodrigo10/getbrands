import { formatCurrency } from "@/lib/utils";

interface OrderSummarySectionProps {
  subtotal: number;
  shippingCost: number;
}

export const OrderSummarySection = ({ subtotal, shippingCost }: OrderSummarySectionProps) => {
  const total = subtotal + shippingCost;

  return (
    <div className="pt-4 border-t space-y-2">
      <div className="flex justify-between text-sm">
        <span>Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span>Shipping:</span>
        <span>{formatCurrency(shippingCost)}</span>
      </div>
      <div className="flex justify-between font-medium pt-2 border-t">
        <span>Total:</span>
        <span>{formatCurrency(total)}</span>
      </div>
    </div>
  );
};