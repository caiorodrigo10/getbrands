import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleRequestSample = async () => {
    try {
      setIsLoading(true);
      
      // Fetch product data first
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) {
        throw error;
      }
      
      if (!product) {
        throw new Error('Product not found');
      }

      // Add to cart
      await addItem(product as Product);
      
      // Track sample request event
      trackEvent("Sample Requested", {
        product_id: productId
      });

      return true;
    } catch (error: any) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add sample to cart. Please try again.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequestSample
  };
};