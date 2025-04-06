
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
    cartOperations: !!addItem && !!loadCartItems
  });

  const handleRequestSample = async () => {
    try {
      console.log("ProductAction: handleRequestSample - Starting sample request flow");
      setIsLoading(true);
      
      if (!user) {
        console.log("ProductAction: handleRequestSample - No user, redirecting to login");
        toast({
          title: "Login Required",
          description: "Please log in to request samples.",
        });
        navigate("/login");
        return false;
      }

      console.log(`ProductAction: handleRequestSample - Requesting sample for product ID: ${productId}`);
      
      // Fetch product data first
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (productError) {
        console.error("ProductAction: handleRequestSample - Error fetching product:", productError);
        throw productError;
      }
      
      if (!product) {
        console.error("ProductAction: handleRequestSample - Product not found");
        throw new Error("Product not found");
      }

      console.log("ProductAction: handleRequestSample - Found product:", product);
      
      if (!addItem) {
        console.error("ProductAction: handleRequestSample - addItem function is not available");
        throw new Error("Cart functionality is not available");
      }
      
      // Add the product to cart using the CartContext
      await addItem(product as Product);
      console.log("ProductAction: handleRequestSample - Product added to cart");
      
      // Reload cart items to ensure UI is updated
      if (loadCartItems) {
        console.log("ProductAction: handleRequestSample - Reloading cart items");
        await loadCartItems();
      } else {
        console.warn("ProductAction: handleRequestSample - loadCartItems function is not available");
      }
      
      try {
        // Track sample request event
        trackEvent("Sample Requested", {
          product_id: productId,
          product_name: product.name
        });
      } catch (trackError) {
        console.error("ProductAction: handleRequestSample - Error tracking event:", trackError);
      }

      // Success message
      toast({
        title: "Sample Added",
        description: `${product.name} has been added to your cart.`,
      });
      
      // After adding to cart, navigate to the checkout confirmation page
      console.log("ProductAction: handleRequestSample - Navigating to checkout confirmation");
      setTimeout(() => {
        navigate("/checkout/confirmation", { replace: true });
      }, 800);
      
      return true;
    } catch (error: any) {
      console.error('ProductAction: handleRequestSample - Error requesting sample:', error);
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
