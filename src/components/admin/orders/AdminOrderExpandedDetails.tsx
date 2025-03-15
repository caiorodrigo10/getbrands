
import { motion } from "framer-motion";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { calculateOrderSubtotal } from "@/lib/orderCalculations";

interface AdminOrderExpandedDetailsProps {
  order: {
    id: string;
    shipping_address: string;
    shipping_city: string;
    shipping_state: string;
    shipping_zip: string;
    products: Array<{
      id?: string;
      quantity: number;
      unit_price: number;
      product: {
        name: string;
        id: string;
        image_url: string | null;
        from_price?: number;
      };
    }> | null;
    tracking_number?: string | null;
    first_name?: string;
    last_name?: string;
    customer?: {
      first_name: string;
      last_name: string;
      email: string;
    };
    shipping_cost?: number;
    subtotal?: number;
  };
}

const AdminOrderExpandedDetails = ({ order }: AdminOrderExpandedDetailsProps) => {
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState(order.tracking_number || "");
  
  // Ensure products is always an array, even if null
  const products = Array.isArray(order.products) ? order.products.filter(item => item && item.product) : [];
  
  // Calculate totals correctly
  const subtotal = order.subtotal || (products.length > 0 ? calculateOrderSubtotal(products) : 0);
  const shippingCost = order.shipping_cost || 0;
  const total = subtotal + shippingCost;

  // Debug log for products data
  console.log("Admin order expanded details - products:", products);

  useEffect(() => {
    // Update tracking number if order changes
    setTrackingNumber(order.tracking_number || "");
  }, [order.tracking_number]);

  const handleUpdateTracking = async () => {
    try {
      const { error } = await supabase
        .from('sample_requests')
        .update({ tracking_number: trackingNumber })
        .eq('id', order.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Tracking number updated successfully",
      });
    } catch (error) {
      console.error('Error updating tracking number:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update tracking number",
      });
    }
  };

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.2 }}
      className="overflow-hidden"
    >
      <div className="p-6 space-y-6 bg-gray-50">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <h4 className="font-semibold text-lg mb-4">Customer Details</h4>
            <Card className="p-4">
              <p className="font-medium">
                {order.customer?.first_name || order.first_name || 'Unknown'} {order.customer?.last_name || order.last_name || ''}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {order.customer?.email || "No email available"}
              </p>
              <div className="mt-4 pt-4 border-t">
                <p className="text-sm font-medium mb-1">Shipping Address:</p>
                <p className="text-sm">{order.shipping_address || 'N/A'}</p>
                <p className="text-sm">
                  {order.shipping_city || 'N/A'}, {order.shipping_state || 'N/A'} {order.shipping_zip || 'N/A'}
                </p>
              </div>
            </Card>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Order Details</h4>
            <Card className="p-4">
              <div className="space-y-4">
                {products.length > 0 ? (
                  products.map((item) => (
                    <div key={item.id || `${item.product?.id || 'unknown'}-${Math.random()}`} className="flex items-start gap-3">
                      <img
                        src={item.product?.image_url || "/placeholder.svg"}
                        alt={item.product?.name || "Unknown Product"}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      <div>
                        <h5 className="font-medium">{item.product?.name || "Unknown Product"}</h5>
                        <p className="text-sm text-muted-foreground">
                          SKU: {item.product?.id ? item.product.id.slice(0, 8) : 'N/A'}
                        </p>
                        <p className="text-sm font-medium mt-1">
                          {item.quantity || 1}x {formatCurrency(item.unit_price || item.product?.from_price || 0)}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No products found for this order.</p>
                )}

                <div className="pt-4 border-t space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Shipping:</span>
                    <span>{formatCurrency(shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span>Total:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-lg mb-4">Tracking Information</h4>
          <Card className="p-4">
            <div className="flex gap-3">
              <Input
                placeholder="Enter tracking number"
                value={trackingNumber}
                onChange={(e) => setTrackingNumber(e.target.value)}
              />
              <Button onClick={handleUpdateTracking}>
                Update Tracking
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminOrderExpandedDetails;
