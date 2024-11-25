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
import { Checkbox } from "@/components/ui/checkbox";
import { OrderSelectionBar } from "./OrderSelectionBar";
import { DeleteConfirmationDialog } from "../catalog/DeleteConfirmationDialog";
import { useDeleteOrders } from "./hooks/useDeleteOrders";

interface AdminOrdersTableProps {
  orders: any[];
  totalOrders?: number;
}

const AdminOrdersTable = ({ orders, totalOrders = 0 }: AdminOrdersTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [selectedOrders, setSelectedOrders] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const { deleteOrders } = useDeleteOrders();

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

  const handleSelectOrder = (orderId: string, checked: boolean) => {
    if (checked) {
      setSelectedOrders([...selectedOrders, orderId]);
    } else {
      setSelectedOrders(selectedOrders.filter(id => id !== orderId));
      setSelectAllPages(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
      setSelectAllPages(false);
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setSelectedOrders(orders.map(order => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  const handleDeleteSelected = async () => {
    const success = await deleteOrders(selectedOrders);
    if (success) {
      setSelectedOrders([]);
      setShowDeleteDialog(false);
      setSelectAllPages(false);
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">No orders found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {selectedOrders.length > 0 && (
        <OrderSelectionBar
          selectedCount={selectAllPages ? totalOrders : selectedOrders.length}
          totalCount={totalOrders}
          selectAllPages={selectAllPages}
          onSelectAllPages={handleSelectAllPages}
          onDeleteClick={() => setShowDeleteDialog(true)}
          ordersInPage={orders.length}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedOrders.length === orders.length || selectAllPages}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
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
              const totalItems = order.products?.reduce((sum: number, item: any) => sum + (item.quantity || 1), 0) || 0;
              
              return (
                <React.Fragment key={order.id}>
                  <TableRow>
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.includes(order.id) || selectAllPages}
                        onCheckedChange={(checked) => handleSelectOrder(order.id, checked as boolean)}
                      />
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
                    <TableCell>{totalItems} items</TableCell>
                    <TableCell>
                      <OrderStatusBadge status={order.status} />
                    </TableCell>
                    <TableCell>
                      {formatCurrency(order.total || 0)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
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
                      </div>
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

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSelected}
        selectAllPages={selectAllPages}
      />
    </div>
  );
};

export default AdminOrdersTable;