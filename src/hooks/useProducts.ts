import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";
import { useWindowSize } from "./useWindowSize";
import { useToast } from "./use-toast";

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
  const { toast } = useToast();
  const isMobile = width ? width < 768 : false;

  const fetchProducts = async ({ pageParam = 1 }) => {
    try {
      const from = (pageParam - 1) * limit;
      const to = from + limit - 1;

      let query = supabase
        .from("products")
        .select("*, product_images(*)", { count: "exact" });

      if (searchTerm) {
        const formattedSearch = searchTerm.replace(/[%_]/g, '\\$&').trim();
        query = query
          .ilike('name', `%${formattedSearch}%`)
          .or(`description.ilike.%${formattedSearch}%`);
      }

      const { data, count, error } = await query;

      if (error) {
        console.error("Error fetching products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again.",
        });
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
    } catch (error) {
      console.error("Error in fetchProducts:", error);
      throw error;
    }
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