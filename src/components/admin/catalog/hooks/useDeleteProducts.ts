import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/ui/use-toast";

export const useDeleteProducts = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteProducts = async (selectedProducts: string[]) => {
    try {
      const { error: cartItemsError } = await supabase
        .from('cart_items')
        .delete()
        .in('product_id', selectedProducts);

      if (cartItemsError) throw cartItemsError;

      const { error: sampleRequestProductsError } = await supabase
        .from('sample_request_products')
        .delete()
        .in('product_id', selectedProducts);

      if (sampleRequestProductsError) throw sampleRequestProductsError;

      const { error: productsError } = await supabase
        .from('products')
        .delete()
        .in('id', selectedProducts);

      if (productsError) throw productsError;

      queryClient.invalidateQueries({ queryKey: ["admin-catalog"] });
      
      return true;
    } catch (error) {
      console.error('Delete error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to delete products. Please try again.",
      });
      return false;
    }
  };

  return { deleteProducts };
};