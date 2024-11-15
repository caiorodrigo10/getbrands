import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderStatusBadge from "@/components/sample-orders/OrderStatusBadge";
import AdminOrderExpandedDetails from "./AdminOrderExpandedDetails";
import { formatCurrency } from "@/lib/utils";

interface AdminOrdersTableProps {
  orders: any[];
}

const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => {
  const { toast } = useToast();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('sample_requests')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully",
      });
    } catch (error) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update order status",
      });
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
            <TableHead>Customer</TableHead>
            <TableHead>Order Number</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Total</TableHead>
            <TableHead className="w-12"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <TableRow>
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
                  <div className="flex flex-col">
                    <span className="font-medium">
                      {order.customer?.first_name} {order.customer?.last_name}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {order.customer?.email}
                    </span>
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
                <TableCell>{order.products?.length || 0} items</TableCell>
                <TableCell>
                  <OrderStatusBadge status={order.status} />
                </TableCell>
                <TableCell>
                  {formatCurrency(order.products?.reduce((total: number, item: any) => 
                    total + (item.product.from_price || 0), 0) || 0)}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'processing')}>
                        Mark as Processing
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'shipped')}>
                        Mark as Shipped
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'completed')}>
                        Mark as Completed
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleStatusChange(order.id, 'canceled')}>
                        Mark as Canceled
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <TableRow key={`${order.id}-expanded`}>
                    <TableCell colSpan={8}>
                      <AdminOrderExpandedDetails order={order} />
                    </TableCell>
                  </TableRow>
                )}
              </AnimatePresence>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrdersTable;