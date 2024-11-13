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

interface CatalogLayoutProps {
  products: Product[];
  isLoading: boolean;
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const ITEMS_PER_PAGE = 9; // Changed from 12 to 9

const CatalogLayout = ({ products, isLoading, onRequestSample, onSelectProduct }: CatalogLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil((products?.length || 0) / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products?.slice(startIndex, startIndex + ITEMS_PER_PAGE) || [];

  return (
    <div className="space-y-8">
      <div className="flex flex-col space-y-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Seja bem-vindo, Caio Rodrigo!</h1>
            <p className="text-gray-600 mt-2">Escolha um produto para customizar</p>
          </div>
          <div className="flex items-center gap-4">
            <CatalogHeader />
            <CartButton />
          </div>
        </div>

        <div className="w-full overflow-x-auto">
          <CatalogFilters />
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
    </div>
  );
};

export default CatalogLayout;