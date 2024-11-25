import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { calculateOrderSubtotal } from "@/lib/orderCalculations";

interface OrderProduct {
  id: string;
  name: string;
  image_url: string | null;
  from_price: number;
  quantity?: number;
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
      <div className="p-3 sm:p-6 space-y-4 sm:space-y-6 bg-gray-50">
        {/* Mobile Product List */}
        <div className="block sm:hidden space-y-3">
          <h4 className="font-medium text-base">Products</h4>
          {order.products.map((product) => (
            <Card key={product.id} className="p-3">
              <div className="flex gap-3">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <h5 className="font-medium text-sm truncate">{product.name}</h5>
                  <p className="text-xs text-gray-500">SKU: {product.id.slice(0, 8)}</p>
                  <p className="text-sm font-medium mt-1">
                    {product.quantity || 1} x {formatCurrency(product.from_price)}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Desktop Product List */}
        <div className="hidden sm:block">
          <h4 className="font-semibold text-lg mb-4">Product Details</h4>
          <div className="space-y-4">
            {order.products.map((product) => (
              <div key={product.id} className="flex items-start gap-4 bg-white p-4 rounded-lg">
                <img
                  src={product.image_url || "/placeholder.svg"}
                  alt={product.name}
                  className="w-20 h-20 object-cover rounded"
                />
                <div>
                  <h5 className="font-medium">{product.name}</h5>
                  <p className="text-sm text-gray-600">SKU: {product.id.slice(0, 8)}</p>
                  <p className="text-sm font-medium mt-2">
                    {product.quantity || 1} x {formatCurrency(product.from_price)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address - Mobile */}
        <div className="block sm:hidden">
          <h4 className="font-medium text-base mb-2">Shipping Address</h4>
          <Card className="p-3">
            {order.first_name && order.last_name && (
              <p className="text-sm font-medium">
                {order.first_name} {order.last_name}
              </p>
            )}
            <p className="text-sm">{order.shipping_address}</p>
            <p className="text-sm">
              {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
            </p>
            {order.tracking_number && (
              <div className="mt-2 pt-2 border-t">
                <p className="text-xs font-medium">Tracking Number:</p>
                <p className="text-xs text-gray-600">{order.tracking_number}</p>
              </div>
            )}
          </Card>
        </div>

        {/* Shipping Address - Desktop */}
        <div className="hidden sm:block">
          <h4 className="font-semibold text-lg mb-3">Shipping Address</h4>
          <div className="bg-white p-4 rounded-lg">
            {order.first_name && order.last_name && (
              <p className="font-medium mb-2">
                {order.first_name} {order.last_name}
              </p>
            )}
            <p>{order.shipping_address}</p>
            <p>
              {order.shipping_city}, {order.shipping_state} {order.shipping_zip}
            </p>
            {order.tracking_number && (
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium">Tracking Number:</p>
                <p className="text-sm text-gray-600">{order.tracking_number}</p>
              </div>
            )}
          </div>
        </div>

        {/* Payment Summary */}
        <div className="bg-white p-3 sm:p-4 rounded-lg max-w-sm ml-auto">
          <h4 className="font-medium text-base sm:text-lg mb-3">Order Summary</h4>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderExpandedDetails;