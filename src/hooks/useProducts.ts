import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProducts = () => {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) {
        throw new Error(error.message);
      }

      return data as Product[];
    },
    // Cache the data for 24 hours
    staleTime: 1000 * 60 * 60 * 24,
    // Keep the data in cache even when window is unfocused
    refetchOnWindowFocus: false,
    // Don't refetch on component mount if we have data
    refetchOnMount: false,
  });
};
