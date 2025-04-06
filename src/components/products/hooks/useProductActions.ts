
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useUserPermissions } from "@/lib/permissions";

export const useProductActions = (product: Product) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showInsufficientPointsDialog, setShowInsufficientPointsDialog] = useState(false);
  const [showPermissionDeniedDialog, setShowPermissionDeniedDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { hasFullAccess, isAdmin } = useUserPermissions();

  // Add debug log
  console.log("useProductActions(product) - Check:", {
    productId: product?.id,
    hasFullAccess,
    isAdmin,
    userId: user?.id
  });

  const handleProjectSelection = async (projectId: string) => {
    try {
      setIsLoading(true);
      const { data: existingProduct, error: checkError } = await supabase
        .from('project_products')
        .select('*')
        .eq('project_id', projectId)
        .eq('product_id', product.id)
        .maybeSingle();

      if (existingProduct) {
        toast({
          variant: "destructive",
          title: "Product already selected",
          description: "This product is already in your project.",
        });
        return;
      }

      const { data: currentProject, error: projectError } = await supabase
        .from('projects')
        .select('points_used, name')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      const newPointsUsed = (currentProject?.points_used || 0) + 1000;
      const { error: updateError } = await supabase
        .from('projects')
        .update({ points_used: newPointsUsed })
        .eq('id', projectId);

      if (updateError) throw updateError;

      const { error: insertError } = await supabase
        .from('project_products')
        .insert({
          project_id: projectId,
          product_id: product.id
        });

      if (insertError) throw insertError;

      navigate("/products/success", {
        state: {
          product: {
            name: product?.name,
            image_url: product?.image_url
          },
          project: {
            name: currentProject.name
          }
        },
        replace: true
      });

    } catch (error) {
      console.error('Error selecting product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to select product. Please try again.",
      });
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
          title: "Error",
          description: "You must be logged in to select products.",
        });
        return;
      }

      // Debug permissions
      console.log("handleSelectProduct - User permissions check:", { hasFullAccess, isAdmin, user });

      // Check if the user has appropriate permissions
      const canSelectProduct = hasFullAccess || isAdmin;
      
      if (!canSelectProduct) {
        setShowPermissionDeniedDialog(true);
        return;
      }

      try {
        // Fetch user projects with enough points
        const { data: userProjects, error: projectsError } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id);

        console.log("User projects fetched:", userProjects, "Error:", projectsError);
        
        if (projectsError) {
          toast({
            variant: "destructive",
            title: "Error",
            description: "Failed to load projects. Please try again.",
          });
          return;
        }

        if (!userProjects || userProjects.length === 0) {
          toast({
            variant: "destructive",
            title: "No Projects Available",
            description: "You need to create a project first before adding products.",
          });
          return;
        }

        const projectsWithSufficientPoints = userProjects?.filter(project => {
          const availablePoints = (project.points || 0) - (project.points_used || 0);
          return availablePoints >= 1000;
        }) || [];

        console.log("Projects with sufficient points:", projectsWithSufficientPoints);

        if (projectsWithSufficientPoints.length > 0) {
          setProjects(projectsWithSufficientPoints);
          setShowProjectDialog(true);
        } else {
          setShowInsufficientPointsDialog(true);
        }
      } catch (error) {
        console.error('Error loading projects:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "An unexpected error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleScheduleCall = () => {
    navigate("/schedule-demo");
  };

  return {
    isLoading,
    showProjectDialog,
    showInsufficientPointsDialog,
    showPermissionDeniedDialog,
    projects,
    setShowProjectDialog,
    setShowInsufficientPointsDialog,
    setShowPermissionDeniedDialog,
    handleProjectSelection,
    handleSelectProduct,
    handleScheduleCall
  };
};
