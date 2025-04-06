
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 
import { supabaseAdmin } from "@/lib/supabase/admin";
import { Product } from "@/types/product";
import { useUserPermissions } from "@/lib/permissions";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useUserPermissions();

  // Debug log to track admin status
  console.log("useProductActions - Admin status check:", {
    productId,
    isAdmin,
    userId: user?.id
  });

  const handleRequestSample = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          title: "Login Required",
          description: "Please log in to request samples.",
        });
        navigate("/login");
        return false;
      }

      // Use the appropriate client based on admin status
      const supabaseClient = isAdmin ? supabaseAdmin : supabase;

      // Check if product is already in cart
      const { data: cartItems, error: cartError } = await supabaseClient
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (cartError) throw cartError;

      if (cartItems && cartItems.length > 0) {
        toast({
          title: "Already in Cart",
          description: "This product is already in your cart.",
        });
        return true;
      }

      // Add product to cart using the client
      const { error: insertError } = await supabaseClient
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: productId,
        });

      if (insertError) throw insertError;

      toast({
        title: "Sample Added",
        description: "Sample has been added to your cart.",
      });
      
      return true;
    } catch (error: any) {
      console.error("Error requesting sample:", error);
      toast({
        variant: "destructive", 
        title: "Error",
        description: error.message || "An error occurred while adding to cart.",
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequestSample,
  };
};

export default useProductActions;
