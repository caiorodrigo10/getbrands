import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";

interface OrderExpandedDetailsProps {
  order: any;
}

const OrderExpandedDetails = ({ order }: OrderExpandedDetailsProps) => {
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
            <div className="flex items-start gap-4 bg-white p-4 rounded-lg">
              <img
                src={order.product?.image_url || "/placeholder.svg"}
                alt={order.product?.name}
                className="w-20 h-20 object-cover rounded"
              />
              <div>
                <h5 className="font-medium">{order.product?.name}</h5>
                <p className="text-sm text-gray-600">SKU: {order.product?.id.slice(0, 8)}</p>
                <p className="text-sm text-gray-600 mt-2">
                  1 x {formatCurrency(order.product?.from_price || 0)} = {formatCurrency(order.product?.from_price || 0)}
                </p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <h4 className="font-semibold text-lg">Shipping Address</h4>
            <div className="bg-white p-4 rounded-lg">
              <p>{order.shipping_address}</p>
              <p>{order.shipping_city}, {order.shipping_state} {order.shipping_zip}</p>
              <p>United States</p>
            </div>
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-white p-4 rounded-lg max-w-sm ml-auto">
          <h4 className="font-semibold text-lg mb-4">Payment Details</h4>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(order.product?.from_price || 0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping:</span>
              <span>{formatCurrency(4.50)}</span>
            </div>
            <div className="flex justify-between">
              <span>Credits Applied:</span>
              <span>{formatCurrency(0)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-semibold">
                <span>Total:</span>
                <span>{formatCurrency((order.product?.from_price || 0) + 4.50)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default OrderExpandedDetails;