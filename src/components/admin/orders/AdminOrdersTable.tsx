import React, { useState } from "react";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { OrderSelectionBar } from "./OrderSelectionBar";
import { DeleteConfirmationDialog } from "../catalog/DeleteConfirmationDialog";
import { useDeleteOrders } from "./hooks/useDeleteOrders";
import { useOrderSelection } from "./hooks/useOrderSelection";
import { OrderTableHeader } from "./components/OrderTableHeader";
import { OrderTableRow } from "./components/OrderTableRow";
import AdminOrderExpandedDetails from "./AdminOrderExpandedDetails";

interface AdminOrdersTableProps {
  orders: any[];
  totalOrders: number;
}

const AdminOrdersTable = ({ orders, totalOrders }: AdminOrdersTableProps) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);
  const [updatingOrderId, setUpdatingOrderId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteOrders } = useDeleteOrders();
  
  const {
    selectAllPages,
    handleSelectOrder,
    handleSelectAll,
    handleSelectAllPages,
    getSelectedCount,
    isOrderSelected,
  } = useOrderSelection(totalOrders);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      setUpdatingOrderId(orderId);
      const { error } = await supabase
        .from('sample_requests')
        .update({ status: newStatus })
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

  const handleDeleteSelected = async () => {
    const selectedIds = orders
      .filter(order => isOrderSelected(order.id))
      .map(order => order.id);

    const success = await deleteOrders(selectedIds);
    if (success) {
      setShowDeleteDialog(false);
      handleSelectAll(false, []);
      queryClient.invalidateQueries({ queryKey: ["admin-orders"] });
    }
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">No orders found matching your criteria.</p>
      </div>
    );
  }

  const selectedCount = getSelectedCount();

  return (
    <div className="space-y-4">
      {selectedCount > 0 && (
        <OrderSelectionBar
          selectedCount={selectedCount}
          totalCount={totalOrders}
          selectAllPages={selectAllPages}
          onSelectAllPages={handleSelectAllPages}
          onDeleteClick={() => setShowDeleteDialog(true)}
          ordersInPage={orders.length}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <OrderTableHeader 
            onSelectAll={(checked) => handleSelectAll(checked, orders)}
            allSelected={orders.every(order => isOrderSelected(order.id))}
            orders={orders}
          />
          <TableBody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <OrderTableRow
                  order={order}
                  isSelected={isOrderSelected(order.id)}
                  onSelect={(checked) => handleSelectOrder(order.id, checked)}
                  isExpanded={expandedOrderId === order.id}
                  onToggleExpand={() => toggleOrderExpansion(order.id)}
                  onStatusChange={(status) => handleStatusChange(order.id, status)}
                  isUpdating={updatingOrderId === order.id}
                />
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