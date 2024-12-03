import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

export const useProductActions = (productId: string, showNotification: boolean = true) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, loadCartItems } = useCart();
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
        
      if (error) throw error;
      
      await addItem(product as Product);
      await loadCartItems(); // Reload cart items after adding
      
      // Track sample request event
      trackEvent("Sample Requested", {
        product_id: productId
      });

      // Only show toast if showNotification is true
      if (showNotification) {
        toast({
          title: "Item added to cart",
          description: `${product.name} has been added to your cart.`
        });
      }

      // Return true to indicate success
      return true;
    } catch (error) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add sample to cart. Please try again.",
      });
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