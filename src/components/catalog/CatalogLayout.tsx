import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { CartButton } from "@/components/CartButton";
import { useState, useRef, useCallback, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";
import { useProducts } from "@/hooks/useProducts";
import { useWindowSize } from "@/hooks/useWindowSize";

const CatalogLayout = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();
  const { width } = useWindowSize();
  const isMobile = width < 768;
  const loadMoreRef = useRef(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  const { 
    data: productsData, 
    isLoading,
    error,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage
  } = useProducts({ 
    page: currentPage,
    limit: isMobile ? 7 : 9,
    infinite: isMobile
  });

  useEffect(() => {
    if (productsData?.pages) {
      const products = productsData.pages.flatMap(page => page.data);
      setAllProducts(products);
    }
  }, [productsData]);

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [target] = entries;
    if (target.isIntersecting && hasNextPage && !isFetchingNextPage && isMobile) {
      fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage, isMobile]);

  useEffect(() => {
    const element = loadMoreRef.current;
    if (!element || !isMobile) return;

    const observer = new IntersectionObserver(handleObserver, {
      threshold: 0.1,
    });

    observer.observe(element);
    return () => observer.disconnect();
  }, [handleObserver, isMobile]);

  if (error) {
    toast({
      variant: "destructive",
      title: "Error loading products",
      description: "Failed to load products. Please try again.",
    });
  }

  return (
    <div className="space-y-page">
      <div className="space-y-section">
        <div>
          <h1 className="text-page-title mb-2">Welcome!</h1>
          <p className="text-muted-foreground">Choose a product to customize</p>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="w-full md:flex-1 overflow-x-auto">
            <CatalogFilters />
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <CatalogHeader />
            <CartButton />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {Array.from({ length: isMobile ? 7 : 9 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="h-[200px] w-full" />
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            ))}
          </div>
        ) : allProducts && allProducts.length > 0 ? (
          <>
            <ProductGrid products={allProducts} />
            {isMobile && (
              <div 
                ref={loadMoreRef} 
                className="w-full py-8 flex justify-center"
              >
                {isFetchingNextPage && (
                  <div className="space-y-4">
                    <Skeleton className="h-[200px] w-full" />
                    <Skeleton className="h-4 w-[250px]" />
                  </div>
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground">No products found.</p>
          </div>
        )}
        
        {!isMobile && productsData?.pages?.[0]?.totalPages && productsData.pages[0].totalPages > 1 && (
          <div className="mt-section flex justify-center">
            <CatalogPagination
              currentPage={currentPage}
              totalPages={productsData.pages[0].totalPages}
              onPageChange={setCurrentPage}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default CatalogLayout;