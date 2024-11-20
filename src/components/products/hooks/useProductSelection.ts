import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";

export const useProductSelection = (product: Product) => {
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showInsufficientPointsDialog, setShowInsufficientPointsDialog] = useState(false);
  const [showPermissionDeniedDialog, setShowPermissionDeniedDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleProjectSelection = async (projectId: string) => {
    try {
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
    }
  };

  const handleScheduleCall = () => {
    navigate("/schedule-call");
  };

  return {
    showProjectDialog,
    setShowProjectDialog,
    showInsufficientPointsDialog,
    setShowInsufficientPointsDialog,
    showPermissionDeniedDialog,
    setShowPermissionDeniedDialog,
    projects,
    setProjects,
    handleProjectSelection,
    handleScheduleCall,
  };
};