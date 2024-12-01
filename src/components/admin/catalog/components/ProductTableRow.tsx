import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";

interface ProductTableRowProps {
  product: Product;
  selected: boolean;
  onSelect: (checked: boolean) => void;
  onEdit: () => void;
  productImage: string;
}

export const ProductTableRow = ({ 
  product, 
  selected, 
  onSelect, 
  onEdit,
  productImage 
}: ProductTableRowProps) => {
  return (
    <TableRow key={product.id}>
      <TableCell>
        <Checkbox
          checked={selected}
          onCheckedChange={onSelect}
        />
      </TableCell>
      <TableCell>
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80"
          onClick={onEdit}
        >
          <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
            <img
              src={productImage}
              alt={product.name}
              className="h-full w-full object-contain"
              onError={(e) => {
                const img = e.target as HTMLImageElement;
                img.src = "/placeholder.svg";
              }}
            />
          </div>
          <div>
            <p className="font-medium hover:underline">{product.name}</p>
          </div>
        </div>
      </TableCell>
      <TableCell>{product.category}</TableCell>
      <TableCell>{formatCurrency(product.from_price)}</TableCell>
      <TableCell>
        <div className="space-x-2">
          {product.is_new && <Badge>NEW</Badge>}
          {product.is_tiktok && <Badge variant="secondary">TIKTOK</Badge>}
        </div>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={onEdit}>
              <Pencil className="h-4 w-4 mr-2" />
              Edit Product
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};