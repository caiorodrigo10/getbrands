import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleRequestSample = async () => {
    if (!user) {
      return;
    }

    setIsLoading(true);
    try {
      const { data: product } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();

      if (!product) throw new Error('Product not found');

      await addItem(product);
      
      // Removed toast notification here
      
      navigate("/pedido-amostra");
    } catch (error) {
      console.error('Error requesting sample:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequestSample
  };
};