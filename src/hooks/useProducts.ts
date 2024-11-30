import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";
import { useWindowSize } from "./useWindowSize";

interface UseProductsOptions {
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  data: Product[];
  totalPages: number;
  totalCount: number;
}

export const useProducts = ({ page = 1, limit = 9 }: UseProductsOptions = {}) => {
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");
  const { width } = useWindowSize();
  const isMobile = width ? width < 768 : false;

  const fetchProducts = async ({ pageParam = 1 }) => {
    const from = (pageParam - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("products").select("*", { count: "exact" });

    if (searchTerm) {
      // Properly format search terms for PostgreSQL ilike
      const formattedSearch = searchTerm
        .replace(/[%_]/g, '\\$&') // Escape special PostgreSQL characters
        .trim();
      
      query = query.or(
        `name.ilike.%${formattedSearch}%,description.ilike.%${formattedSearch}%`
      );
    }

    const { count } = await query;

    let dataQuery = supabase.from("products").select("*");

    if (searchTerm) {
      // Use the same formatted search term
      const formattedSearch = searchTerm
        .replace(/[%_]/g, '\\$&')
        .trim();
        
      dataQuery = dataQuery.or(
        `name.ilike.%${formattedSearch}%,description.ilike.%${formattedSearch}%`
      );
    }

    const { data, error } = await dataQuery
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw error;
    }

    const totalCount = count || 0;
    const hasNextPage = from + limit < totalCount;

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
      queryKey: ["products-infinite", { limit, search: searchTerm }],
      queryFn: fetchProducts,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });
  }

  // Use regular useQuery for desktop
  return useQuery({
    queryKey: ["products", { page, limit, search: searchTerm }],
    queryFn: () => fetchProducts({ pageParam: page }),
  });
};