
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client"; 
import { useUserPermissions } from "@/lib/permissions";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { Product } from "@/types/product";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useUserPermissions();
  const { addItem, loadCartItems } = useCart();

  console.log("useProductActions - initialized with:", {
    productId,
    isAdmin,
    userId: user?.id,
    cartOperations: {
      addItemExists: !!addItem,
      loadCartItemsExists: !!loadCartItems
    }
  });

  const handleRequestSample = async () => {
    try {
      console.log("[ORDER SAMPLE] Starting sample request flow");
      setIsLoading(true);
      
      if (!user) {
        console.log("[ORDER SAMPLE] No user, redirecting to login");
        toast({
          title: "Login Required",
          description: "Please log in to request samples.",
        });
        navigate("/login");
        return false;
      }

      console.log(`[ORDER SAMPLE] Requesting sample for product ID: ${productId}, user ID: ${user.id}`);
      
      // Fetch product data first
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (productError) {
        console.error("[ORDER SAMPLE] Error fetching product:", productError);
        throw productError;
      }
      
      if (!product) {
        console.error("[ORDER SAMPLE] Product not found");
        throw new Error("Product not found");
      }

      console.log("[ORDER SAMPLE] Found product:", product);
      
      if (!addItem) {
        console.error("[ORDER SAMPLE] addItem function is not available");
        throw new Error("Cart functionality is not available");
      }
      
      // Debug: Check addItem function
      console.log("[ORDER SAMPLE] Before adding to cart - addItem function:", typeof addItem);
      
      try {
        // Add the product to cart using the CartContext
        console.log("[ORDER SAMPLE] Attempting to add product to cart with addItem");
        const result = await addItem(product as Product);
        console.log("[ORDER SAMPLE] Add to cart completed, result:", result);
        
        // Try to directly add the item to the cart_items table
        console.log("[ORDER SAMPLE] Directly adding to cart_items table as fallback");
        const { data: directInsert, error: insertError } = await supabase
          .from('cart_items')
          .insert({
            user_id: user.id,
            product_id: product.id
          })
          .select();
          
        console.log("[ORDER SAMPLE] Direct insert result:", { data: directInsert, error: insertError });
      } catch (cartError) {
        console.error("[ORDER SAMPLE] Error during cart operations:", cartError);
      }
      
      // Reload cart items to ensure UI is updated
      if (loadCartItems) {
        console.log("[ORDER SAMPLE] Reloading cart items");
        try {
          await loadCartItems();
        } catch (loadError) {
          console.error("[ORDER SAMPLE] Error reloading cart items:", loadError);
        }
      } else {
        console.warn("[ORDER SAMPLE] loadCartItems function is not available");
      }
      
      try {
        // Track sample request event
        trackEvent("Sample Requested", {
          product_id: productId,
          product_name: product.name
        });
      } catch (trackError) {
        console.error("[ORDER SAMPLE] Error tracking event:", trackError);
      }

      // Success message
      toast({
        title: "Sample Added",
        description: `${product.name} has been added to your cart.`,
      });
      
      // After adding to cart, navigate to the checkout confirmation page
      console.log("[ORDER SAMPLE] Navigating to checkout confirmation");
      setTimeout(() => {
        navigate("/checkout/confirmation", { replace: true });
      }, 800);
      
      return true;
    } catch (error: any) {
      console.error('[ORDER SAMPLE] Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add sample to cart. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = async () => {
    try {
      setIsLoading(true);
      
      if (!user) {
        toast({
          variant: "destructive", 
          title: "Authentication Required",
          description: "Please log in to select products."
        });
        return false;
      }
      
      // Get projects for the current user
      const { data: projects, error: projectError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
        
      if (projectError) {
        throw projectError;
      }
      
      console.log("Available projects:", projects);
      
      if (!projects || projects.length === 0) {
        toast({
          variant: "destructive",
          title: "No Projects Found",
          description: "You need to create a project first before selecting products."
        });
        return false;
      }
      
      // Check for projects with sufficient points
      const availableProjects = projects.filter(project => {
        const remainingPoints = (project.points || 0) - (project.points_used || 0);
        return remainingPoints >= 1000;
      });
      
      if (availableProjects.length === 0) {
        toast({
          variant: "destructive",
          title: "Insufficient Points",
          description: "You don't have enough points in any project to select this product."
        });
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error in handleSelectProduct:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process your request. Please try again."
      });
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleRequestSample,
    handleSelectProduct
  };
};
