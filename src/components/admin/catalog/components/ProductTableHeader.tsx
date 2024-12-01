import { TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";

interface ProductTableHeaderProps {
  onSelectAll: (checked: boolean) => void;
  allSelected: boolean;
}

export const ProductTableHeader = ({ onSelectAll, allSelected }: ProductTableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-[50px]">
          <Checkbox
            checked={allSelected}
            onCheckedChange={onSelectAll}
          />
        </TableHead>
        <TableHead>Product</TableHead>
        <TableHead>Category</TableHead>
        <TableHead>Cost</TableHead>
        <TableHead>Status</TableHead>
        <TableHead className="w-[70px]"></TableHead>
      </TableRow>
    </TableHeader>
  );
};