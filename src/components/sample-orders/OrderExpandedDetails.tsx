import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

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
  };
}

const OrderExpandedDetails = ({ order }: OrderExpandedDetailsProps) => {
  const calculateSubtotal = (products: OrderProduct[]) => {
    return products.reduce((total, product) => {
      return total + (product.from_price * (product.quantity || 1));
    }, 0);
  };

  const calculateShippingCost = (products: OrderProduct[]) => {
    const totalItems = products.reduce((sum, product) => sum + (product.quantity || 1), 0);
    // Base shipping rate of $4.50 for first item, $2 for each additional item
    return 4.50 + Math.max(0, totalItems - 1) * 2;
  };

  const subtotal = calculateSubtotal(order.products);
  const shippingCost = calculateShippingCost(order.products);
  const total = subtotal + shippingCost;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="p-6 space-y-6 bg-gray-50">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Product Details */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Product Details</h4>
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
                    <p className="text-sm text-gray-600 mt-2">
                      {product.quantity || 1} x {formatCurrency(product.from_price)} = {formatCurrency(product.from_price * (product.quantity || 1))}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Shipping Address</h4>
            <div className="bg-white p-4 rounded-lg">
              {order.first_name && order.last_name && (
                <p className="font-medium mb-2">
                  Shipped to: {order.first_name} {order.last_name}
                </p>
              )}
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p>United States</p>
              {order.tracking_number && (
                <div className="mt-4 pt-4 border-t">
                  <p className="text-sm font-medium">Tracking Number:</p>
                  <p className="text-sm text-gray-600">{order.tracking_number}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-4 rounded-lg max-w-sm ml-auto">
          <h4 className="font-semibold text-lg mb-4">Payment Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(shippingCost)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
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