import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";

interface AdminCatalogTableProps {
  products: Product[];
}

const AdminCatalogTable = ({ products }: AdminCatalogTableProps) => {
  const navigate = useNavigate();

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/catalog/${productId}`);
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Product</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price Range</TableHead>
            <TableHead>Profit</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[70px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div 
                  className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                  onClick={() => handleEditProduct(product.id)}
                >
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="h-12 w-12 rounded-md object-cover"
                  />
                  <div>
                    <p className="font-medium hover:underline">{product.name}</p>
                    <p className="text-sm text-muted-foreground line-clamp-1">
                      {product.description}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{product.category}</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <p>From: {formatCurrency(product.from_price)}</p>
                  <p>SRP: {formatCurrency(product.srp)}</p>
                </div>
              </TableCell>
              <TableCell>
                <div className="bg-green-500 text-white px-2 py-1 rounded-md inline-block">
                  {formatCurrency(product.srp - product.from_price)}
                </div>
              </TableCell>
              <TableCell>
                <div className="space-x-2">
                  {product.is_new && (
                    <Badge>NEW</Badge>
                  )}
                  {product.is_tiktok && (
                    <Badge variant="secondary">TIKTOK</Badge>
                  )}
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
                    <DropdownMenuItem onClick={() => handleEditProduct(product.id)}>
                      <Pencil className="h-4 w-4 mr-2" />
                      Edit Product
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminCatalogTable;