import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { formatCurrency } from "@/lib/utils";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductEditForm } from "./ProductEditForm";

interface AdminCatalogTableProps {
  products: Product[];
}

const AdminCatalogTable = ({ products }: AdminCatalogTableProps) => {
  const { toast } = useToast();
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleCloseDialog = () => {
    setEditingProduct(null);
  };

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: updatedProduct.name,
          category: updatedProduct.category,
          description: updatedProduct.description,
          from_price: updatedProduct.from_price,
          srp: updatedProduct.srp,
          is_new: updatedProduct.is_new,
          is_tiktok: updatedProduct.is_tiktok,
        })
        .eq('id', updatedProduct.id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      handleCloseDialog();
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    }
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 border rounded-md">
        <p className="text-lg text-muted-foreground">No products found matching your criteria.</p>
      </div>
    );
  }

  return (
    <>
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
                  <div className="flex items-center gap-3">
                    <img
                      src={product.image_url || "/placeholder.svg"}
                      alt={product.name}
                      className="h-12 w-12 rounded-md object-cover"
                    />
                    <div>
                      <p className="font-medium">{product.name}</p>
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
                      <DropdownMenuItem onClick={() => handleEditProduct(product)}>
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

      <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          {editingProduct && (
            <ProductEditForm
              product={editingProduct}
              onSubmit={handleUpdateProduct}
              onCancel={handleCloseDialog}
            />
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default AdminCatalogTable;