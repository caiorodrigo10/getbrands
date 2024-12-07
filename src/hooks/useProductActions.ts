import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleRequestSample = async () => {
    setIsLoading(true);
    try {
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single();

      if (error) throw error;

      await addItem({ ...product, quantity: 1 });
      
      toast({
        title: "Success",
        description: "Sample added to cart"
      });
    } catch (error) {
      console.error("Error requesting sample:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add sample to cart"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequestSample
  };
};