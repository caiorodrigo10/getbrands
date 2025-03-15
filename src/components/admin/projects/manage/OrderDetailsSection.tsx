
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { OrderSummarySection } from "./OrderSummarySection";

interface OrderDetailsSectionProps {
  request: any;
  subtotal: number;
  shippingCost: number;
}

export const OrderDetailsSection = ({ request, subtotal, shippingCost }: OrderDetailsSectionProps) => {
  // Debug log for the products data
  console.log('OrderDetailsSection products:', request.products);
  
  // Make sure products is always an array, even if it's null or undefined
  const products = Array.isArray(request.products) ? request.products : [];
  
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="p-4 border-t bg-gray-50">
        <div className="space-y-4">
          {products.length > 0 ? (
            products.map((item: any) => (
              <div key={item.id || `${item.product?.id || 'unknown'}-${Math.random()}`} className="flex items-start gap-3">
                <img
                  src={item.product?.image_url || "/placeholder.svg"}
                  alt={item.product?.name || "Product"}
                  className="w-16 h-16 object-cover rounded-md"
                />
                <div>
                  <h5 className="font-medium">{item.product?.name || "Unnamed Product"}</h5>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity || 1}</p>
                  <p className="text-sm font-medium mt-1">
                    {formatCurrency(item.unit_price || item.product?.from_price || 0)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-gray-500">No products found for this order.</p>
          )}

          <OrderSummarySection
            subtotal={subtotal}
            shippingCost={shippingCost}
          />

          {request.tracking_number && (
            <div className="pt-4 border-t">
              <p className="text-sm font-medium">Tracking Number:</p>
              <p className="text-sm">{request.tracking_number}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
