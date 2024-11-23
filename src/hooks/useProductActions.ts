import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleRequestSample = async () => {
    try {
      setIsLoading(true);
      
      // Fetch product data first
      const { data: product, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (error) throw error;
      
      await addItem(product as Product);
      
      // Track sample request event
      trackEvent("Sample Requested", {
        product_id: productId
      });

      return true;
    } catch (error) {
      console.error('Error requesting sample:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequestSample
  };
};