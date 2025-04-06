
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";
import AdminCatalogTable from "@/components/admin/catalog/AdminCatalogTable";
import { ImportProductsDialog } from "@/components/admin/bulk-actions/ImportProductsDialog";
import AdminPagination from "@/components/admin/AdminPagination";

const AdminCatalog = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(15);
  const [showImportDialog, setShowImportDialog] = useState(false);

  // Removing the redundant auth check that was causing redirection

  const { data: productsData, isLoading } = useQuery({
    queryKey: ["admin-catalog", page, pageSize],
    queryFn: async () => {
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      const { data, error, count } = await supabase
        .from("products")
        .select("*", { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;

      return {
        data,
        totalProducts: count || 0,
        totalPages: Math.ceil((count || 0) / pageSize),
        pageCount: Math.ceil((count || 0) / pageSize),
        currentPage: page
      };
    },
  });

  const filteredProducts = productsData?.data?.filter(product => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const productName = product.name.toLowerCase();
    const productCategory = product.category.toLowerCase();
    
    return productName.includes(searchLower) || 
           productCategory.includes(searchLower);
  });

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Catalog Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all products in the catalog
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by product name or category..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={() => setShowImportDialog(true)}
            >
              <Upload className="h-4 w-4 mr-2" />
              Import Products
            </Button>
            <Button onClick={() => navigate("/admin/catalog/create")}>
              <Plus className="h-4 w-4 mr-2" />
              Add Product
            </Button>
          </div>
        </div>
      </div>

      <AdminCatalogTable 
        products={filteredProducts || []} 
        totalProducts={productsData?.totalProducts || 0}
      />

      {productsData?.pageCount && productsData.pageCount > 1 && (
        <AdminPagination
          page={page}
          pageCount={productsData.pageCount}
          pageSize={pageSize}
          totalItems={productsData.totalProducts || 0}
          onPageChange={handlePageChange}
          setPageSize={setPageSize}
        />
      )}

      <ImportProductsDialog 
        open={showImportDialog} 
        onOpenChange={setShowImportDialog}
      />
    </div>
  );
};

export default AdminCatalog;
