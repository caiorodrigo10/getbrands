import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, MoreVertical, Truck, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderStatusBadge from "./OrderStatusBadge";
import OrderExpandedDetails from "./OrderExpandedDetails";
import { formatCurrency } from "@/lib/utils";

interface OrderTableProps {
  orders: any[];
  onOrdersChange?: () => void;
}

const OrderTable = ({ orders, onOrdersChange }: OrderTableProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

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

  const handleCancelOrder = async (orderId: string) => {
    if (isDeleting) return;

    try {
      setIsDeleting(true);
      const { error } = await supabase
        .from('sample_requests')
        .update({ status: 'canceled' })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order canceled successfully",
      });

      if (onOrdersChange) {
        onOrdersChange();
      }
    } catch (error) {
      console.error('Error canceling order:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to cancel order. Please try again.",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  return (
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
            <TableHead className="w-12"></TableHead>
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>View Details</DropdownMenuItem>
                      {order.tracking_number && (
                        <DropdownMenuItem>Track Shipment</DropdownMenuItem>
                      )}
                      {order.status?.toLowerCase() === "pending" && (
                        <DropdownMenuItem 
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={isDeleting}
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <TableRow>
                    <TableCell colSpan={9}>
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
  );
};

export default OrderTable;