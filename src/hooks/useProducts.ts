import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

interface UseProductsOptions {
  page?: number;
  limit?: number;
}

export const useProducts = ({ page = 1, limit = 9 }: UseProductsOptions = {}) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return useQuery({
    queryKey: ["products", { page, limit }],
    queryFn: async () => {
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
      };
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    keepPreviousData: true, // Keep previous page data while loading next page
  });
};