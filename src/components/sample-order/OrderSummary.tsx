interface OrderSummaryProps {
  subtotal: number;
  shippingCost: number;
}

export const OrderSummary = ({ subtotal, shippingCost }: OrderSummaryProps) => {
  const total = subtotal + shippingCost;

  return (
    <div className="w-64 space-y-3 bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Subtotal:</span>
        <span className="font-semibold text-gray-900">${subtotal.toFixed(2)}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-600">Shipping:</span>
        <span className="font-semibold text-gray-900">${shippingCost.toFixed(2)}</span>
      </div>
      <div className="border-t pt-3 mt-3">
        <div className="flex justify-between">
          <span className="font-semibold text-gray-900">Total:</span>
          <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
};