import { Table, TableBody } from "@/components/ui/table";
import { Product } from "@/types/product";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SelectionBar } from "./SelectionBar";
import { DeleteConfirmationDialog } from "./DeleteConfirmationDialog";
import { useDeleteProducts } from "./hooks/useDeleteProducts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductTableHeader } from "./components/ProductTableHeader";
import { ProductTableRow } from "./components/ProductTableRow";
import { useProductSelection } from "./hooks/useProductSelection";

interface AdminCatalogTableProps {
  products: Product[];
  totalProducts: number;
}

const AdminCatalogTable = ({ products, totalProducts }: AdminCatalogTableProps) => {
  const navigate = useNavigate();
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const { deleteProducts } = useDeleteProducts();
  
  const {
    selectedProducts,
    selectAllPages,
    handleSelectProduct,
    handleSelectAll,
    handleSelectAllPages,
    handleDuplicateSelected,
    setSelectedProducts
  } = useProductSelection(products, totalProducts);

  const handleEditProduct = (productId: string) => {
    navigate(`/admin/catalog/${productId}`);
  };

  const handleDeleteSelected = async () => {
    const success = await deleteProducts(selectedProducts);
    if (success) {
      setSelectedProducts([]);
      setShowDeleteDialog(false);
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
    const primaryImage = productImages?.find(img => img.product_id === product.id)?.image_url;
    const imageUrl = primaryImage || product.image_url || "/placeholder.svg";
    
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    } else if (imageUrl.startsWith('/')) {
      return imageUrl;
    } else {
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
          <ProductTableHeader
            onSelectAll={handleSelectAll}
            allSelected={selectedProducts.length === products.length || selectAllPages}
          />
          <TableBody>
            {products.map((product) => (
              <ProductTableRow
                key={product.id}
                product={product}
                selected={selectedProducts.includes(product.id) || selectAllPages}
                onSelect={(checked) => handleSelectProduct(product.id, checked)}
                onEdit={() => handleEditProduct(product.id)}
                productImage={getProductImage(product)}
              />
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