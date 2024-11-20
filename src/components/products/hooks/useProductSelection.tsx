import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";

export const useProductSelection = (product: Product) => {
  const [currentDialog, setCurrentDialog] = useState<"project" | "insufficientPoints" | "permissionDenied" | null>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSelectProduct = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to select products.",
      });
      return;
    }

    const userRole = user?.role;
    const isRestrictedRole = userRole === "member" || userRole === "sampler";

    if (isRestrictedRole) {
      setCurrentDialog("permissionDenied");
      return;
    }

    try {
      const { data: userProjects, error: projectsError } = await supabase
        .from('projects')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active');

      if (projectsError) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load projects. Please try again.",
        });
        return;
      }

      const projectsWithSufficientPoints = userProjects?.filter(project => {
        const availablePoints = (project.points || 0) - (project.points_used || 0);
        return availablePoints >= 1000;
      }) || [];

      if (projectsWithSufficientPoints.length > 0) {
        setProjects(projectsWithSufficientPoints);
        setCurrentDialog("project");
      } else {
        setCurrentDialog("insufficientPoints");
      }
    } catch (error) {
      console.error('Error loading projects:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
      });
    }
  };

  return {
    currentDialog,
    setCurrentDialog,
    projects,
    handleSelectProduct
  };
};