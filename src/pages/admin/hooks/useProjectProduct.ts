import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProjectProduct = (id?: string) => {
  const { toast } = useToast();
  const isNewProduct = id === 'new';

  const handleUpdateProduct = async (updatedProduct: Product) => {
    try {
      if (isNewProduct) {
        const { error } = await supabase
          .from('project_specific_products')
          .insert({
            name: updatedProduct.name,
            category: updatedProduct.category,
            description: updatedProduct.description,
            from_price: updatedProduct.from_price,
            srp: updatedProduct.srp,
            is_new: updatedProduct.is_new,
            is_tiktok: updatedProduct.is_tiktok,
          });

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product created successfully",
        });
      } else {
        const { error } = await supabase
          .from('project_specific_products')
          .update({
            name: updatedProduct.name,
            category: updatedProduct.category,
            description: updatedProduct.description,
            from_price: updatedProduct.from_price,
            srp: updatedProduct.srp,
            is_new: updatedProduct.is_new,
            is_tiktok: updatedProduct.is_tiktok,
          })
          .eq('id', updatedProduct.id);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      }
    } catch (error) {
      console.error('Error saving product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save product",
      });
    }
  };

  return {
    handleUpdateProduct,
    isNewProduct,
  };
};