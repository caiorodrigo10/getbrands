import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const ITEMS_PER_PAGE = 15;

export const useSampleOrders = (currentPage: number, selectedStatus: string) => {
  const { user } = useAuth();
  const { toast } = useToast();

  return useQuery({
    queryKey: ["sample-orders", currentPage, selectedStatus, user?.id],
    queryFn: async () => {
      if (!user) throw new Error("User not authenticated");

      let query = supabase
        .from("sample_requests")
        .select(`
          *,
          products:sample_request_products (
            quantity,
            unit_price,
            product:products (
              id,
              name,
              image_url
            )
          )
        `, { count: 'exact' })
        .eq('user_id', user.id);

      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return {
        data,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        currentPage
      };
    },
    enabled: !!user,
  });
};