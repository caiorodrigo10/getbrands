import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Package } from "lucide-react";
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
      };
    }>;
  };
}

const OrderDetails = ({ orderDetails }: OrderDetailsProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-semibold">Order Details</h3>
          <p className="text-sm text-muted-foreground">
            Order #{orderDetails.id.slice(0, 8)}
          </p>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="font-medium mb-4">Product Details</h3>
          {orderDetails.sample_request_products.map(({ product }) => (
            <div key={product.id} className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg mb-4">
              <Package className="h-12 w-12 text-muted-foreground" />
              <div>
                <h4 className="font-medium">{product.name}</h4>
                <p className="text-sm text-muted-foreground">
                  SKU: {product.id.slice(0, 8)}
                </p>
                <p className="text-sm mt-2">
                  1 x {formatCurrency(product.from_price)}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div>
          <h3 className="font-medium mb-4">Shipping Address</h3>
          <div className="bg-muted/50 p-4 rounded-lg">
            <p>{orderDetails.shipping_address}</p>
            <p>
              {orderDetails.shipping_city}, {orderDetails.shipping_state}{" "}
              {orderDetails.shipping_zip}
            </p>
            <p>Brazil</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OrderDetails;