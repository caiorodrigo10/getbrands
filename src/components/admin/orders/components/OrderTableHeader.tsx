import React from 'react';
import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface OrderTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
  orders: any[];
}

export const OrderTableHeader = ({ onSelectAll, allSelected, orders }: OrderTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={allSelected}
            onCheckedChange={(checked) => onSelectAll(checked as boolean)}
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
  );
};