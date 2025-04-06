
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { trackEvent } from "@/lib/analytics";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useUserPermissions } from "@/lib/permissions";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export const useProductActions = (productId: string) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem, loadCartItems } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const { hasFullAccess, isAdmin } = useUserPermissions();

  // Debug log to help trace permission issues
  console.log("useProductActions - Permissions check:", { 
    productId, 
    hasFullAccess, 
    isAdmin, 
    userId: user?.id
  });

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

      // Return true to indicate success
      return true;
    } catch (error) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add sample to cart. Please try again."
      });
      throw error;
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
