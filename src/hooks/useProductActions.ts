import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();

  const handleRequestSample = async () => {
    try {
      setIsLoading(true);
      await addItem(productId);
      
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