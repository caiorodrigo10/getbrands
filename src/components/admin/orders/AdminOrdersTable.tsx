import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreVertical, ChevronDown, ChevronUp } from "lucide-react";
import { AnimatePresence } from "framer-motion";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import OrderStatusBadge from "@/components/sample-orders/OrderStatusBadge";
import AdminOrderExpandedDetails from "./AdminOrderExpandedDetails";
import { formatCurrency } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";
import { calculateOrderSubtotal } from "@/lib/orderCalculations";

interface AdminOrdersTableProps {
  orders: any[];
}

const AdminOrdersTable = ({ orders }: AdminOrdersTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    if (updatingOrderId) return;

    try {
      setUpdatingOrderId(orderId);

      const { error } = await supabase
        .from('sample_requests')
        .update({ 
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ["admin-orders"] });

      toast({
        title: "Status updated",
        description: `Order status has been changed to ${newStatus}`,
      });
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to update order status",
      });
    } finally {
      setUpdatingOrderId(null);
    }
  };

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">No orders found matching your criteria.</p>
      </div>
    );
  }

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
          {orders.map((order) => {
            const subtotal = calculateOrderSubtotal(order.products || []);
            // Usar o shipping_cost armazenado ou calcular baseado nas regras antigas se não existir
            const total = subtotal + (order.shipping_cost || 0);
            
            return (
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
                    {formatCurrency(total)}
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="icon"
                          disabled={updatingOrderId === order.id}
                        >
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="bg-white">
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'pending')}
                          disabled={updatingOrderId === order.id}
                        >
                          Mark as Pending
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'processing')}
                          disabled={updatingOrderId === order.id}
                        >
                          Mark as Processing
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'shipped')}
                          disabled={updatingOrderId === order.id}
                        >
                          Mark as Shipped
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'completed')}
                          disabled={updatingOrderId === order.id}
                        >
                          Mark as Completed
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          onClick={() => handleStatusChange(order.id, 'canceled')}
                          disabled={updatingOrderId === order.id}
                        >
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
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminOrdersTable;