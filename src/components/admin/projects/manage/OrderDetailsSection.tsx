import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { OrderSummarySection } from "./OrderSummarySection";

interface OrderDetailsSectionProps {
  request: any;
  subtotal: number;
  shippingCost: number;
}

export const OrderDetailsSection = ({ request, subtotal, shippingCost }: OrderDetailsSectionProps) => {
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
          {request.products?.map((item: any) => (
            <div key={item.product.id} className="flex items-start gap-3">
              <img
                src={item.product.image_url || "/placeholder.svg"}
                alt={item.product.name}
                className="w-16 h-16 object-cover rounded-md"
              />
              <div>
                <h5 className="font-medium">{item.product.name}</h5>
                <p className="text-sm font-medium mt-1">
                  {formatCurrency(item.product.from_price)}
                </p>
              </div>
            </div>
          ))}

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