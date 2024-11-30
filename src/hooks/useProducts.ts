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
      // Create a properly formatted search filter
      query = query.or(
        `name.ilike.%${searchTerm.replace(/[%,]/g, "").trim()}%,description.ilike.%${searchTerm
          .replace(/[%,]/g, "")
          .trim()}%`
      );
    }

    const { count } = await query;

    let dataQuery = supabase.from("products").select("*");

    if (searchTerm) {
      // Use the same formatted search filter
      dataQuery = dataQuery.or(
        `name.ilike.%${searchTerm.replace(/[%,]/g, "").trim()}%,description.ilike.%${searchTerm
          .replace(/[%,]/g, "")
          .trim()}%`
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

  if (isMobile) {
    return useInfiniteQuery({
      queryKey: ["products-infinite", { limit, search: searchTerm }],
      queryFn: fetchProducts,
      initialPageParam: 1,
      getNextPageParam: (lastPage) => lastPage.nextPage,
    });
  }

  return useQuery({
    queryKey: ["products", { page, limit, search: searchTerm }],
    queryFn: () => fetchProducts({ pageParam: page }),
  });
};