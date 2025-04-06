
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";
import { useWindowSize } from "./useWindowSize";

interface UseProductsOptions {
  page?: number;
  limit?: number;
}

export const useProducts = ({ page = 1, limit = 9 }: UseProductsOptions = {}) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");
  
  // Properly decode the URL categories parameter
  const categoriesParam = searchParams.get("categories");
  const categories = categoriesParam ? 
    decodeURIComponent(categoriesParam).split(",").map(cat => cat.trim()) : 
    [];
    
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const fetchProducts = async ({ pageParam = 1 }) => {
    const from = (pageParam - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("products").select("*", { count: "exact" });

    // Enhanced search to include description field
    if (searchTerm) {
      const formattedSearch = searchTerm.replace(/[%_]/g, '\\$&').trim();
      query = query
        .or(`name.ilike.%${formattedSearch}%,category.ilike.%${formattedSearch}%,description.ilike.%${formattedSearch}%`);
    }

    if (categories.length > 0) {
      query = query.in('category', categories);
    }

    // First get the count
    const { count } = await query;

    // Then get the data using the same query conditions
    let dataQuery = supabase.from("products").select("*");

    // Apply the same conditions to data query
    if (searchTerm) {
      const formattedSearch = searchTerm.replace(/[%_]/g, '\\$&').trim();
      dataQuery = dataQuery
        .or(`name.ilike.%${formattedSearch}%,category.ilike.%${formattedSearch}%,description.ilike.%${formattedSearch}%`);
    }

    if (categories.length > 0) {
      dataQuery = dataQuery.in('category', categories);
    }

    const { data, error } = await dataQuery
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching products:", error);
      throw error;
    }

    const totalCount = count || 0;
    const hasNextPage = from + limit < totalCount;

    console.log(`Fetched ${data?.length || 0} products, totalCount: ${totalCount}, hasNextPage: ${hasNextPage}`);

    return {
      data: data as Product[],
      totalPages: Math.ceil(totalCount / limit),
      totalCount: totalCount,
      nextPage: hasNextPage ? pageParam + 1 : undefined,
    };
  };

  // Use React Query's useInfiniteQuery for mobile
  if (isMobile) {
    return useInfiniteQuery({
      queryKey: ["products-infinite", { limit, search: searchTerm, categories }],
      queryFn: fetchProducts,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });
  }

  // Use regular useQuery for desktop
  return useQuery({
    queryKey: ["products", { page, limit, search: searchTerm, categories }],
    queryFn: () => fetchProducts({ pageParam: page }),
  });
};
