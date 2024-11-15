import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { formatCurrency } from "@/lib/utils";

interface OrderSummaryProps {
  orderDetails: {
    sample_request_products: Array<{
      product: {
        from_price: number;
      };
    }>;
  };
}

const OrderSummary = ({ orderDetails }: OrderSummaryProps) => {
  const subtotal = orderDetails.sample_request_products.reduce(
    (sum, { product }) => sum + product.from_price,
    0
  );
  const shippingCost = 4.50;
  const total = subtotal + shippingCost;

  return (
    <Card className="mt-4 sm:mt-6">
      <CardContent className="pt-4 sm:pt-6">
        <h3 className="text-base sm:text-lg font-medium mb-3 sm:mb-4">Payment Summary</h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-muted-foreground">Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-sm sm:text-base">
            <span className="text-muted-foreground">Shipping</span>
            <span>{formatCurrency(shippingCost)}</span>
          </div>
          <Separator className="my-2" />
          <div className="flex justify-between font-medium text-sm sm:text-base">
            <span>Total</span>
            <span>{formatCurrency(total)}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderSummary;