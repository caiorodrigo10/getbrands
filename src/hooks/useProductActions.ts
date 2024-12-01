import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

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

      // Navigate to checkout after successful add
      navigate("/checkout/confirmation", { replace: true });
      
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