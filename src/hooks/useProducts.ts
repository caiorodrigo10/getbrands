import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";

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

  const fetchProducts = async () => {
    const from = (page - 1) * limit;
    const to = from + limit - 1;

    let query = supabase.from("products").select("*", { count: "exact" });

    if (searchTerm) {
      query = query.or(`name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`);
    }

    const { count } = await query;

    let dataQuery = supabase
      .from("products")
      .select("*");

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
    };
  };

  return useQuery({
    queryKey: ["products", { page, limit, search: searchTerm }],
    queryFn: fetchProducts,
  });
};