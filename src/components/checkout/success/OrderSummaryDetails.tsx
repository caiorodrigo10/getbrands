import { formatCurrency } from "@/lib/utils";
import { Package } from "lucide-react";

interface OrderSummaryDetailsProps {
  orderDetails: {
    id: string;
    products: Array<{
      product: {
        id: string;
        name: string;
        image_url: string | null;
        from_price: number;
      };
      quantity: number;
      unit_price: number;
    }>;
    subtotal: number;
    shipping_cost: number;
    total: number;
  };
}

export const OrderSummaryDetails = ({ orderDetails }: OrderSummaryDetailsProps) => {
  return (
    <div>
      <h4 className="font-medium mb-4">Order Summary</h4>
      <div className="space-y-4">
        {orderDetails.products.map((item) => (
          <div key={item.product.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
              <img
                src={item.product.image_url || "/placeholder.svg"}
                alt={item.product.name}
                className="h-full w-full object-cover"
              />
            </div>
            <div>
              <h5 className="font-medium">{item.product.name}</h5>
              <p className="text-sm text-muted-foreground mt-1">
                {formatCurrency(item.unit_price)}
              </p>
              <p className="text-sm font-medium mt-1">
                Quantity: {item.quantity}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Subtotal</span>
          <span>{formatCurrency(orderDetails.subtotal)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Shipping</span>
          <span>{formatCurrency(orderDetails.shipping_cost)}</span>
        </div>
        <div className="flex justify-between font-medium pt-4 border-t">
          <span>Total</span>
          <span>{formatCurrency(orderDetails.total)}</span>
        </div>
      </div>

      <div className="flex justify-between items-center pt-6 border-t mt-6">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Package className="h-4 w-4" />
          <span>Order #{orderDetails.id.slice(0, 6)}</span>
        </div>
      </div>
    </div>
  );
};