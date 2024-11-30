import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { CartButton } from "@/components/CartButton";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { UseQueryResult } from "@tanstack/react-query";

const CatalogLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const productsQuery = useProducts({ 
    page: currentPage,
    limit: 9
  }) as UseQueryResult<any>;

  const { 
    data: productsData,
    isLoading,
    error,
  } = productsQuery;

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Failed to load products. Please try again.",
    });
  }

  const totalPages = productsData?.totalPages || 1;

  return (
    <div className="flex flex-col min-h-screen">
      <div className="flex-grow">
        <div>
          <h1 className="text-page-title mb-2">Welcome!</h1>
          <p className="text-muted-foreground">Choose a product to customize</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-6">
          <div className="w-full md:flex-1 overflow-x-auto">
            <CatalogFilters />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <CatalogHeader />
            <CartButton />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            {Array.from({ length: 9 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : productsData?.data && productsData.data.length > 0 ? (
          <div className="mt-6">
            <ProductGrid products={productsData.data} />
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found.</p>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="mt-8 mb-4">
          <CatalogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
};

export default CatalogLayout;