import { formatCurrency } from "@/lib/utils";

interface PaymentSummaryProps {
  subtotal: number;
  shippingCost: number;
  total: number;
}

const PaymentSummary = ({ subtotal, shippingCost, total }: PaymentSummaryProps) => {
  return (
    <div className="mb-6 space-y-2">
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Subtotal:</span>
        <span>{formatCurrency(subtotal)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-muted-foreground">Shipping:</span>
        <span>{formatCurrency(shippingCost)}</span>
      </div>
      <div className="pt-2 border-t">
        <div className="flex justify-between font-medium">
          <span>Total:</span>
          <span>{formatCurrency(total)}</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentSummary;