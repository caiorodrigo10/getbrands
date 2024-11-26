import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { MoreVertical, Pencil } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Product } from "@/types/product";
import { formatCurrency } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { useState } from "react";
import { SelectionBar } from "./SelectionBar";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useDeleteProducts } from "./hooks/useDeleteProducts";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface AdminCatalogTableProps {
  products: Product[];
  totalProducts: number;
}

const AdminCatalogTable = ({ products, totalProducts }: AdminCatalogTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [selectAllPages, setSelectAllPages] = useState(false);
  const { deleteProducts } = useDeleteProducts();

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/catalog/${productId}`);
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, productId]);
    } else {
      setSelectedProducts(selectedProducts.filter(id => id !== productId));
      setSelectAllPages(false);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
      setSelectAllPages(false);
    }
  };

  const handleSelectAllPages = (checked: boolean) => {
    setSelectAllPages(checked);
    if (checked) {
      setSelectedProducts(products.map(product => product.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleDeleteSelected = async () => {
    const success = await deleteProducts(selectedProducts);
    if (success) {
      setSelectedProducts([]);
      setShowDeleteDialog(false);
    }
  };

  const handleDuplicateSelected = async () => {
    try {
      const selectedProductsData = products.filter(p => selectedProducts.includes(p.id));
      
      for (const product of selectedProductsData) {
        const { data: newProduct, error: productError } = await supabase
          .from('products')
          .insert({
            name: `${product.name} (Copy)`,
            category: product.category,
            description: product.description,
            from_price: product.from_price,
            srp: product.srp,
            is_new: product.is_new,
            is_tiktok: product.is_tiktok,
            image_url: product.image_url
          })
          .select()
          .single();

        if (productError) throw productError;

        const { data: productImages } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', product.id);

        if (productImages) {
          for (const image of productImages) {
            await supabase
              .from('product_images')
              .insert({
                product_id: newProduct.id,
                image_url: image.image_url,
                position: image.position,
                is_primary: image.is_primary
              });
          }
        }
      }

      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ['admin-catalog'] });

      toast({
        title: "Success",
        description: `Successfully duplicated ${selectedProducts.length} product(s)`,
      });
    } catch (error) {
      console.error('Error duplicating products:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to duplicate products. Please try again.",
      });
    }
  };

  // Fetch primary images for products
  const { data: productImages } = useQuery({
    queryKey: ['product-images-catalog'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .in('product_id', products.map(p => p.id))
        .eq('is_primary', true);

      if (error) throw error;
      return data || [];
    },
    enabled: products.length > 0,
  });

  const getProductImage = (product: Product) => {
    // First try to get the primary image from product_images
    const primaryImage = productImages?.find(img => img.product_id === product.id)?.image_url;
    // If no primary image found, fall back to the product's main image_url
    const imageUrl = primaryImage || product.image_url || "/placeholder.svg";
    
    // Ensure the URL is properly formatted
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else if (imageUrl.startsWith('/')) {
      return imageUrl; // Local asset
    } else {
      // If it's a Supabase storage URL, ensure it's properly formatted
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(imageUrl);
      return publicUrl;
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
    <div className="space-y-4">
      {selectedProducts.length > 0 && (
        <SelectionBar
          selectedCount={selectAllPages ? totalProducts : selectedProducts.length}
          totalCount={totalProducts}
          selectAllPages={selectAllPages}
          onSelectAllPages={handleSelectAllPages}
          onDeleteClick={() => setShowDeleteDialog(true)}
          onDuplicateClick={handleDuplicateSelected}
          productsInPage={products.length}
        />
      )}

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50px]">
                <Checkbox
                  checked={selectedProducts.length === products.length || selectAllPages}
                  onCheckedChange={(checked) => handleSelectAll(checked as boolean)}
                />
              </TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Cost</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[70px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedProducts.includes(product.id) || selectAllPages}
                    onCheckedChange={(checked) => handleSelectProduct(product.id, checked as boolean)}
                  />
                </TableCell>
                <TableCell>
                  <div 
                    className="flex items-center gap-3 cursor-pointer hover:opacity-80"
                    onClick={() => handleEditProduct(product.id)}
                  >
                    <div className="relative h-12 w-12 rounded-md overflow-hidden bg-gray-100">
                      <img
                        src={getProductImage(product)}
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

      <DeleteConfirmationDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={handleDeleteSelected}
        selectAllPages={selectAllPages}
      />
    </div>
  );
};

export default AdminCatalogTable;