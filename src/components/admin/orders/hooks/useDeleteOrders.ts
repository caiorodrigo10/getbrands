import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteOrders = async (selectedOrders: string[]) => {
    try {
      // First delete related products
      const { error: productsError } = await supabase
        .from('sample_request_products')
        .delete()
        .in('sample_request_id', selectedOrders);

      if (productsError) throw productsError;

      // Then delete the orders
      const { error: ordersError } = await supabase
        .from('sample_requests')
        .delete()
        .in('id', selectedOrders);

      if (ordersError) throw ordersError;

      // Immediately invalidate and refetch queries to refresh the orders list
      await queryClient.invalidateQueries({ 
        queryKey: ["admin-orders"]
      });
      
      toast({
        title: "Success",
        description: `Successfully deleted ${selectedOrders.length} order(s)`,
      });

      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete orders. Please try again.",
      });
      return false;
    }
  };

  return { deleteOrders };
};