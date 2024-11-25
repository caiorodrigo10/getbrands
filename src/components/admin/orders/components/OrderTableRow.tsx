import React from 'react';
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { ChevronDown, ChevronUp, MoreVertical } from "lucide-react";
import OrderStatusBadge from "@/components/sample-orders/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils";

interface OrderTableRowProps {
  order: any;
  isSelected: boolean;
  onSelect: (checked: boolean) => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
  onStatusChange: (status: string) => void;
  isUpdating: boolean;
}

export const OrderTableRow = ({
  order,
  isSelected,
  onSelect,
  isExpanded,
  onToggleExpand,
  onStatusChange,
  isUpdating,
}: OrderTableRowProps) => {
  return (
    <TableRow>
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={onSelect}
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
      <TableCell>{order.products?.length || 0} items</TableCell>
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
            onClick={onToggleExpand}
          >
            {isExpanded ? (
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
                disabled={isUpdating}
              >
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white">
              <DropdownMenuItem 
                onClick={() => onStatusChange('pending')}
                disabled={isUpdating}
              >
                Mark as Pending
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange('processing')}
                disabled={isUpdating}
              >
                Mark as Processing
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange('shipped')}
                disabled={isUpdating}
              >
                Mark as Shipped
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange('completed')}
                disabled={isUpdating}
              >
                Mark as Completed
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onStatusChange('canceled')}
                disabled={isUpdating}
              >
                Mark as Canceled
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </TableCell>
    </TableRow>
  );
};