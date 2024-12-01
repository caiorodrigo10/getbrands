import React from "react";
import { useOrderManagement } from "./hooks/useOrderManagement";
import { OrderList } from "./components/OrderList";
import { OrderSelectionBar } from "./OrderSelectionBar";
import { DeleteConfirmationDialog } from "../catalog/DeleteConfirmationDialog";
import { useOrderSelection } from "./hooks/useOrderSelection";

interface AdminOrdersTableProps {
  orders: any[];
  totalOrders: number;
}

const AdminOrdersTable = ({ orders, totalOrders }: AdminOrdersTableProps) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  
  const {
    expandedOrderId,
    updatingOrderId,
    toggleOrderExpansion,
    handleStatusChange,
  } = useOrderManagement(orders, totalOrders);

  const {
    selectAllPages,
    handleSelectOrder,
    handleSelectAll,
    handleSelectAllPages,
    getSelectedCount,
    isOrderSelected,
    selectedOrders
  } = useOrderSelection(totalOrders);

  const selectedCount = getSelectedCount();

  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">Nenhum pedido encontrado.</p>
      </div>
    );
  }

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

      <OrderList
        orders={orders}
        expandedOrderId={expandedOrderId}
        updatingOrderId={updatingOrderId}
        onToggleExpand={toggleOrderExpansion}
        onStatusChange={handleStatusChange}
        isSelected={isOrderSelected}
        onSelect={handleSelectOrder}
        onSelectAll={handleSelectAll}
        allSelected={orders.every(order => isOrderSelected(order.id))}
      />

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