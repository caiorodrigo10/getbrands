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
      title: "Erro ao carregar produtos",
      description: "Ocorreu um erro ao carregar os produtos. Por favor, tente novamente.",
    });
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-8">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Welcome, Caio Rodrigo!</h1>
          <p className="text-gray-600 mt-2">Choose a product to customize</p>
        </div>

        <div className="flex justify-between items-center gap-4">
          <div className="flex-1 overflow-x-auto">
            <CatalogFilters />
          </div>
          <div className="flex items-center gap-4 min-w-[300px]">
            <CatalogHeader />
            <CartButton />
          </div>
        </div>

        <div>
          <FeaturedSlider />
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: 9 }).map((_, i) => (
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
            <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
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