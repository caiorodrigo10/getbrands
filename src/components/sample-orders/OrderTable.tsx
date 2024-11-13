import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Package, ArrowDown, MoreVertical, Truck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

interface OrderTableProps {
  orders: any[];
  onOrdersChange?: () => void;
}

const OrderTable = ({ orders, onOrdersChange }: OrderTableProps) => {
  const { toast } = useToast();
  const [isDeleting, setIsDeleting] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12"></TableHead>
            <TableHead>Order Type</TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Shipped To</TableHead>
            <TableHead>Tracking #</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <Button variant="ghost" size="icon">
                  <ArrowDown className="h-4 w-4" />
                </Button>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  <span>SAMPLE ORDER</span>
                </div>
              </TableCell>
              <TableCell>SPL{order.id.slice(0, 6)}</TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </TableCell>
              <TableCell>{order.shipping_city || "-"}</TableCell>
              <TableCell>
                {order.tracking_number ? (
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4" />
                    <span>{order.tracking_number}</span>
                  </div>
                ) : (
                  "-"
                )}
              </TableCell>
              <TableCell>
                <Badge className={getStatusColor(order.status)}>
                  {order.status?.toUpperCase() || "PENDING"}
                </Badge>
              </TableCell>
              <TableCell>
                {formatCurrency(order.product?.from_price || 0)}
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
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrderTable;