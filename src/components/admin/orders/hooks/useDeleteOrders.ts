
import { supabaseAdmin } from "@/lib/supabase/admin";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteOrders = async (selectedOrders: string[]) => {
    if (selectedOrders.length === 0) {
      console.log("No orders selected for deletion");
      return false;
    }
    
    console.log("Attempting to delete orders:", selectedOrders);
    
    try {
      // First delete related products
      const { error: productsError } = await supabaseAdmin
        .from('sample_request_products')
        .delete()
        .in('sample_request_id', selectedOrders);

      if (productsError) {
        console.error("Error deleting order products:", productsError);
        throw productsError;
      }

      // Then delete the orders
      const { error: ordersError } = await supabaseAdmin
        .from('sample_requests')
        .delete()
        .in('id', selectedOrders);

      if (ordersError) {
        console.error("Error deleting orders:", ordersError);
        throw ordersError;
      }

      console.log("Successfully deleted orders:", selectedOrders.length);
      
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
