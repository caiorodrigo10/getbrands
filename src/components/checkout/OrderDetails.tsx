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
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <p className="text-sm text-muted-foreground">
            Order #{orderDetails.id.slice(0, 8)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-8">
        <div>
          <h3 className="font-medium mb-4">Product Details</h3>
          <div className="grid gap-4">
            {orderDetails.sample_request_products.map(({ product }) => (
              <div key={product.id} className="flex items-start gap-4 bg-card border rounded-lg p-4 shadow-sm">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-24 h-24 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="font-medium text-lg mb-1">{product.name}</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    SKU: {product.id.slice(0, 8)}
                  </p>
                  <p className="text-sm font-medium">
                    1 x {formatCurrency(product.from_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Shipping Address</h3>
          <div className="bg-card border rounded-lg p-4 shadow-sm">
            <p className="mb-1">{orderDetails.shipping_address}</p>
            <p className="mb-1">
              {orderDetails.shipping_city}, {orderDetails.shipping_state}{" "}
              {orderDetails.shipping_zip}
            </p>
            <p>United States</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;