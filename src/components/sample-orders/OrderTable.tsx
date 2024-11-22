import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Package, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderExpandedDetails from "./OrderExpandedDetails";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

interface OrderTableProps {
  orders: any[];
  onOrdersChange?: () => void;
}

const OrderTable = ({ orders, onOrdersChange }: OrderTableProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  const calculateOrderTotal = (order: any) => {
    const products = order.products || [];
    const subtotal = products.reduce((total: number, product: any) => {
      return total + (product.from_price * (product.quantity || 1));
    }, 0);
    
    const totalItems = products.reduce((sum: number, product: any) => 
      sum + (product.quantity || 1), 0);
    const shippingCost = 4.50 + Math.max(0, totalItems - 1) * 2;
    
    return subtotal + shippingCost;
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"></TableHead>
              <TableHead className="whitespace-nowrap">Order Type</TableHead>
              <TableHead className="whitespace-nowrap">Order Number</TableHead>
              <TableHead className="whitespace-nowrap">Date</TableHead>
              <TableHead className="whitespace-nowrap">Items</TableHead>
              <TableHead className="whitespace-nowrap">Tracking #</TableHead>
              <TableHead className="whitespace-nowrap">Status</TableHead>
              <TableHead className="whitespace-nowrap">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders?.map((order) => (
              <>
                <TableRow key={order.id}>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => toggleOrderExpansion(order.id)}
                    >
                      {expandedOrderId === order.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                    </Button>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <Package className="h-4 w-4 flex-shrink-0" />
                      <span>SAMPLE ORDER</span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">SPL{order.id.slice(0, 6)}</TableCell>
                  <TableCell className="whitespace-nowrap">
                    {new Date(order.created_at).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">{order.products?.length || 0} items</TableCell>
                  <TableCell>
                    {order.tracking_number ? (
                      <div className="flex items-center gap-2 whitespace-nowrap">
                        <Truck className="h-4 w-4 flex-shrink-0" />
                        <span>{order.tracking_number}</span>
                      </div>
                    ) : (
                      "-"
                    )}
                  </TableCell>
                  <TableCell>
                    <OrderStatusBadge status={order.status} />
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {formatCurrency(calculateOrderTotal(order))}
                  </TableCell>
                </TableRow>
                <AnimatePresence>
                  {expandedOrderId === order.id && (
                    <TableRow>
                      <TableCell colSpan={8}>
                        <OrderExpandedDetails order={order} />
                      </TableCell>
                    </TableRow>
                  )}
                </AnimatePresence>
              </>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
          </DialogHeader>
          {selectedOrder && <OrderExpandedDetails order={selectedOrder} />}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default OrderTable;