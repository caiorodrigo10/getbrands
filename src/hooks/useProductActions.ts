
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

  // Debug log to track admin status and product ID
  console.log("useProductActions - Status check:", {
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

      console.log("Requesting sample for product ID:", productId);
      
      // Fetch product data first
      const { data: product, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('id', productId)
        .single();
        
      if (productError) {
        console.error("Error fetching product:", productError);
        throw productError;
      }
      
      if (!product) {
        throw new Error("Product not found");
      }

      console.log("Found product:", product);
      
      // First check if the item is already in the cart
      const { data: cartItems, error: cartError } = await supabase
        .from("cart_items")
        .select("*")
        .eq("user_id", user.id)
        .eq("product_id", productId);

      if (cartError) {
        console.error("Error checking cart:", cartError);
        throw cartError;
      }

      if (cartItems && cartItems.length > 0) {
        console.log("Product already in cart, skipping add operation");
        toast({
          title: "Already in Cart",
          description: `${product.name} is already in your cart.`,
        });
      } else {
        // Add the product to cart using the CartContext
        await addItem(product as Product);
        console.log("Product added to cart successfully");
        
        // Track sample request event
        trackEvent("Sample Requested", {
          product_id: productId,
          product_name: product.name
        });

        // Success message
        toast({
          title: "Sample Added",
          description: `${product.name} has been added to your cart.`,
        });
      }
      
      // Reload cart items to ensure UI is updated
      await loadCartItems();
      console.log("Cart items reloaded");
      
      return true;
    } catch (error: any) {
      console.error('Error requesting sample:', error);
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
      const { data: projects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id);
        
      if (projectsError) {
        throw projectsError;
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
