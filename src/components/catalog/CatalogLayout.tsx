
import { Product } from "@/types/product";
import CatalogHeader from "@/components/CatalogHeader";
import CatalogFilters from "@/components/CatalogFilters";
import ProductGrid from "@/components/ProductGrid";
import CatalogPagination from "./CatalogPagination";
import { CartButton } from "@/components/CartButton";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useProducts";
import { UseQueryResult, UseInfiniteQueryResult } from "@tanstack/react-query";
import { useInView } from "react-intersection-observer";
import { useWindowSize } from "@/hooks/useWindowSize";
import { useSearchParams } from "react-router-dom";
import { useCatalogState } from "@/hooks/useCatalogState";

const MOBILE_ITEMS_PER_PAGE = 7;
const DESKTOP_ITEMS_PER_PAGE = 9;

const CatalogLayout = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { getSavedCatalogState } = useCatalogState();
  const [currentPage, setCurrentPage] = useState(() => {
    const pageParam = searchParams.get("page");
    return pageParam ? parseInt(pageParam, 10) : 1;
  });
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;
  const itemsPerPage = isMobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE;
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  
  // Restore saved catalog state on initial load
  useEffect(() => {
    const savedState = getSavedCatalogState();
    if (savedState) {
      const newParams = new URLSearchParams(searchParams);
      
      // Only set these parameters if they're not already present in the URL
      if (!searchParams.has("page") && savedState.page) {
        newParams.set("page", savedState.page);
        setCurrentPage(parseInt(savedState.page, 10));
      }
      
      if (!searchParams.has("search") && savedState.search) {
        newParams.set("search", savedState.search);
      }
      
      if (!searchParams.has("categories") && savedState.categories) {
        newParams.set("categories", savedState.categories);
      }
      
      // Only update URL if there were changes
      if (newParams.toString() !== searchParams.toString()) {
        setSearchParams(newParams);
      }
    }
  }, []);

  // Update URL when page changes
  useEffect(() => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set("page", currentPage.toString());
    setSearchParams(newParams);
  }, [currentPage, setSearchParams]);
  
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
    rootMargin: '300px',
  });

  const productsQuery = useProducts({ 
    page: currentPage,
    limit: itemsPerPage
  });

  const {
    data: productsData,
    isLoading,
    error,
  } = productsQuery as UseQueryResult<any>;

  const {
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
    data: infiniteData,
  } = productsQuery as UseInfiniteQueryResult<any>;

  useEffect(() => {
    if (isMobile && infiniteData?.pages) {
      const products = infiniteData.pages.flatMap(page => page.data);
      setAllProducts(products);
    } else if (productsData?.data) {
      setAllProducts(productsData.data);
    }
  }, [productsData?.data, infiniteData?.pages, isMobile]);

  useEffect(() => {
    if (inView && isMobile && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, isMobile, hasNextPage, isFetchingNextPage, fetchNextPage]);

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-red-600">Error loading products. Please try again.</p>
      </div>
    );
  }

  const totalPages = productsData?.totalPages || 1;

  return (
    <div className="flex flex-col min-h-screen">
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
          {Array.from({ length: itemsPerPage }).map((_, i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="h-[200px] w-full" />
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          ))}
        </div>
      ) : allProducts.length > 0 ? (
        <>
          <div className="mt-6">
            <ProductGrid products={allProducts} />
          </div>
          {isMobile ? (
            <div ref={loadMoreRef} className="w-full py-8 flex justify-center">
              {isFetchingNextPage && (
                <div className="space-y-4">
                  <Skeleton className="h-[200px] w-full" />
                  <Skeleton className="h-4 w-[250px]" />
                </div>
              )}
            </div>
          ) : totalPages > 1 && (
            <div className="mt-8 w-full">
              <CatalogPagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground">No products found.</p>
        </div>
      )}
    </div>
  );
};

export default CatalogLayout;
