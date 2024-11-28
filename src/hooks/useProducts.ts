import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";

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
  const [searchParams] = useSearchParams();
  const searchTerm = searchParams.get("search");

  const fetchProducts = async ({ pageParam = 1 }) => {
    const from = (pageParam - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("products").select("*", { count: "exact" });

    // Apply search filter if search term exists
    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    // Get total count
    const { count } = await query.select("*", { count: "exact", head: true });

    // Get paginated data
    let dataQuery = supabase
      .from("products")
      .select("*");

    // Apply search filter to data query
    if (searchTerm) {
      dataQuery = dataQuery.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { data, error } = await dataQuery
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
      queryKey: ["products", "infinite", { limit, search: searchTerm }],
      queryFn: fetchProducts,
      getNextPageParam: (lastPage) => lastPage.hasMore ? lastPage.nextPage : undefined,
      initialPageParam: 1,
    });
  }

  return useQuery<ProductsResponse>({
    queryKey: ["products", { page, limit, search: searchTerm }],
    queryFn: () => fetchProducts({ pageParam: page }),
  });
};