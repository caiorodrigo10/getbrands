import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { formatCurrency } from "@/lib/utils";

interface OrderDetailsProps {
  orderDetails: {
    id: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    sample_request_products: Array<{
      product: {
        name: string;
        id: string;
        from_price: number;
        image_url: string | null;
      };
    }>;
  };
}

const OrderDetails = ({ orderDetails }: OrderDetailsProps) => {
  return (
    <Card className="mb-3 sm:mb-6">
      <CardHeader className="p-3 sm:p-6">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-medium">Order Details</h3>
          <p className="text-xs text-muted-foreground">
            Order #{orderDetails.id.slice(0, 8)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 space-y-4 sm:space-y-6">
        <div>
          <h3 className="text-sm font-medium mb-3">Product Details</h3>
          <div className="grid gap-3">
            {orderDetails.sample_request_products.map(({ product }) => (
              <div key={product.id} className="flex items-start gap-3 bg-card border rounded-lg p-3">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{product.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    SKU: {product.id.slice(0, 8)}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    1 x {formatCurrency(product.from_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-medium mb-3">Shipping Address</h3>
          <div className="bg-card border rounded-lg p-3">
            <p className="text-sm">{orderDetails.shipping_address}</p>
            <p className="text-sm mt-1">
              {orderDetails.shipping_city}, {orderDetails.shipping_state}{" "}
              {orderDetails.shipping_zip}
            </p>
            <p className="text-sm mt-1">United States</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;