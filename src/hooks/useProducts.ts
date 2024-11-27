import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

interface UseProductsOptions {
  page?: number;
  limit?: number;
  infinite?: boolean;
}

interface ProductsResponse {
  data: Product[];
  totalPages: number;
  totalCount: number;
  nextPage: number;
  hasMore: boolean;
}

export const useProducts = ({ page = 1, limit = 9, infinite = false }: UseProductsOptions = {}) => {
  const fetchProducts = async (context: { pageParam?: unknown }) => {
    const pageParam = Number(context.pageParam) || page;
    const from = (pageParam - 1) * limit;
    const to = from + limit - 1;

    // First, get total count
    const { count } = await supabase
      .from("products")
      .select("*", { count: "exact", head: true });

    // Then get paginated data
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .range(from, to)
      .order("created_at", { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    return {
      data: data as Product[],
      totalPages: Math.ceil((count || 0) / limit),
      totalCount: count || 0,
      nextPage: pageParam + 1,
      hasMore: from + limit < (count || 0),
    };
  };

  if (infinite) {
    return useInfiniteQuery<ProductsResponse>({
      queryKey: ["products", "infinite", { limit }],
      queryFn: fetchProducts,
      getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
      initialPageParam: 1,
    });
  }

  return useQuery<ProductsResponse>({
    queryKey: ["products", { page, limit }],
    queryFn: () => fetchProducts({ pageParam: page }),
  });
};