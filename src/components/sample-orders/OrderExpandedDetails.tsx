import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { calculateOrderSubtotal } from "@/lib/orderCalculations";

interface OrderProduct {
  product: {
    id: string;
    name: string;
    image_url: string | null;
  };
  quantity: number;
  unit_price: number;
}

interface OrderExpandedDetailsProps {
  order: {
    id: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    products: OrderProduct[];
    tracking_number?: string | null;
    first_name?: string;
    last_name?: string;
    shipping_cost?: number;
    customer?: {
      email?: string;
    };
  };
}

const OrderExpandedDetails = ({ order }: OrderExpandedDetailsProps) => {
  const subtotal = calculateOrderSubtotal(order.products);
  const shippingCost = order.shipping_cost || 0;
  const total = subtotal + shippingCost;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="p-6 space-y-6">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Customer Details Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Customer Details</h3>
            <Card className="p-6">
              <div className="space-y-4">
                <div>
                  <h4 className="text-lg font-medium">
                    {order.first_name} {order.last_name}
                  </h4>
                  <p className="text-gray-600">{order.customer?.email}</p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Address:</h4>
                  <p className="text-gray-600">{order.shipping_address}</p>
                  <p className="text-gray-600">
                    {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Order Details Column */}
          <div>
            <h3 className="text-xl font-semibold mb-4">Order Details</h3>
            <Card className="p-6">
              <div className="space-y-6">
                {/* Products List */}
                <div className="space-y-4">
                  {order.products.map((item) => (
                    <div key={item.product.id} className="flex items-center gap-4">
                      <img
                        src={item.product.image_url || "/placeholder.svg"}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <h5 className="font-medium">{item.product.name}</h5>
                        <p className="text-sm text-gray-600">
                          SKU: {item.product.id.slice(0, 8)}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {item.quantity} x {formatCurrency(item.unit_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Order Summary */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping:</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-medium text-lg pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="border-t pt-4">
                    <p className="text-sm font-medium">Tracking Number:</p>
                    <p className="text-sm text-gray-600">{order.tracking_number}</p>
                  </div>
                )}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderExpandedDetails;