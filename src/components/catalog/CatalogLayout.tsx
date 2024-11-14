import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import FeaturedSlider from "@/components/FeaturedSlider";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { CartButton } from "@/components/CartButton";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useProducts } from "@/hooks/useProducts";

interface CatalogLayoutProps {
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const CatalogLayout = ({ onRequestSample, onSelectProduct }: CatalogLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  
  const { 
    data: productsData, 
    isLoading,
    error 
  } = useProducts({ 
    page: currentPage,
  });

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "An error occurred while loading products. Please try again.",
    });
  }

  return (
    <div className="space-y-6 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900">
            Welcome, Caio Rodrigo!
          </h1>
          <p className="text-gray-600 mt-2">Choose a product to customize</p>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <div className="w-full lg:flex-1 overflow-x-auto">
            <CatalogFilters />
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">
            <CatalogHeader />
            <CartButton />
          </div>
        </div>

        <div className="overflow-hidden">
          <FeaturedSlider />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : productsData?.data && productsData.data.length > 0 ? (
          <ProductGrid
            products={productsData.data}
            onRequestSample={onRequestSample}
            onSelectProduct={onSelectProduct}
          />
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No products found.</p>
          </div>
        )}
        
        {productsData?.totalPages && productsData.totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <CatalogPagination
              currentPage={currentPage}
              totalPages={productsData.totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogLayout;