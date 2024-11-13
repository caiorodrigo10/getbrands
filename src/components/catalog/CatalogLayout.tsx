import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import FeaturedSlider from "@/components/FeaturedSlider";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

interface CatalogLayoutProps {
  products: Product[];
  isLoading: boolean;
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;

const CatalogLayout = ({ products, isLoading, onRequestSample, onSelectProduct }: CatalogLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil((products?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  return (
    <div className="space-y-8">
      <CatalogHeader />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div className="w-full md:w-auto overflow-x-auto">
          <CatalogFilters />
        </div>
      </div>

      <div>
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
      ) : products && products.length > 0 ? (
        <ProductGrid
          products={paginatedProducts}
          onRequestSample={onRequestSample}
          onSelectProduct={onSelectProduct}
        />
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">Nenhum produto encontrado.</p>
        </div>
      )}
      
      {products && products.length > ITEMS_PER_PAGE && (
        <div className="mt-8 flex justify-center">
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