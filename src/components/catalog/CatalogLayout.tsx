import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import FeaturedSlider from "@/components/FeaturedSlider";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { useState } from "react";

interface CatalogLayoutProps {
  products: Product[];
  isLoading: boolean;
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const ITEMS_PER_PAGE = 12;

const CatalogLayout = ({ products, isLoading, onRequestSample, onSelectProduct }: CatalogLayoutProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = products.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  return (
    <div className="p-4 md:p-8 bg-white min-h-screen">
      <CatalogHeader />
      
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
        <div className="w-full md:w-auto overflow-x-auto">
          <CatalogFilters />
        </div>
      </div>

      <div className="mb-8">
        <FeaturedSlider />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-96 bg-gray-100 animate-pulse rounded-lg" />
          ))}
        </div>
      ) : (
        <ProductGrid
          products={paginatedProducts}
          onRequestSample={onRequestSample}
          onSelectProduct={onSelectProduct}
        />
      )}
      
      <div className="mt-8">
        <CatalogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default CatalogLayout;