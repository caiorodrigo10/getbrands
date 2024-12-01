import React from 'react';
import { Table, TableBody } from "@/components/ui/table";
import { OrderTableHeader } from "./OrderTableHeader";
import { OrderTableRow } from "./OrderTableRow";
import { AnimatePresence } from "framer-motion";
import AdminOrderExpandedDetails from "../AdminOrderExpandedDetails";
import { TableCell, TableRow } from "@/components/ui/table";

interface OrderListProps {
  orders: any[];
  expandedOrderId: string | null;
  updatingOrderId: string | null;
  onToggleExpand: (orderId: string) => void;
  onStatusChange: (orderId: string, status: string) => void;
  isSelected: (orderId: string) => boolean;
  onSelect: (orderId: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

export const OrderList = ({
  orders,
  expandedOrderId,
  updatingOrderId,
  onToggleExpand,
  onStatusChange,
  isSelected,
  onSelect,
  onSelectAll,
  allSelected,
}: OrderListProps) => {
  return (
    <div className="rounded-md border">
      <Table>
        <OrderTableHeader
          onSelectAll={onSelectAll}
          allSelected={allSelected}
          orders={orders}
        />
        <TableBody>
          {orders.map((order) => (
            <React.Fragment key={order.id}>
              <OrderTableRow
                order={order}
                isSelected={isSelected(order.id)}
                onSelect={(checked) => onSelect(order.id, checked)}
                isExpanded={expandedOrderId === order.id}
                onToggleExpand={() => onToggleExpand(order.id)}
                onStatusChange={(status) => onStatusChange(order.id, status)}
                isUpdating={updatingOrderId === order.id}
              />
              <AnimatePresence>
                {expandedOrderId === order.id && (
                  <TableRow>
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