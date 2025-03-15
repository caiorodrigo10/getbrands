
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
  // Log the order object to debug
  console.log("OrderTableRow order:", order);
  
  // Get the product count safely - filter out null products
  const validProducts = Array.isArray(order.products) 
    ? order.products.filter(item => item && item.product) 
    : [];
  
  const productCount = validProducts.length;

  // Calculate total quantity of all products
  const totalItemsQuantity = validProducts.reduce((sum, item) => sum + (item.quantity || 1), 0);
  
  // Calculate total safely
  const total = typeof order.total === 'number' 
    ? order.total 
    : (typeof order.subtotal === 'number' && typeof order.shipping_cost === 'number'
      ? order.subtotal + order.shipping_cost
      : 0);

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
            {order.customer?.first_name || order.first_name || 'Unknown'} {order.customer?.last_name || order.last_name || ''}
          </span>
          <span className="text-sm text-muted-foreground">
            {order.customer?.email || "No email"}
          </span>
        </div>
      </TableCell>
      <TableCell>SPL{order.id?.slice(0, 6) || 'N/A'}</TableCell>
      <TableCell>
        {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }) : 'N/A'}
      </TableCell>
      <TableCell>{totalItemsQuantity} items ({productCount} products)</TableCell>
      <TableCell>
        <OrderStatusBadge status={order.status} />
      </TableCell>
      <TableCell>
        {formatCurrency(total)}
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
