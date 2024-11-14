import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import PackSelectionDialog from "../dialogs/PackSelectionDialog";
import ProjectSelectionDialog from "../dialogs/ProjectSelectionDialog";

interface ProductActionsProps {
  productId: string;
  onRequestSample: () => void;
  isLoading: boolean;
}

export const ProductActions = ({ 
  productId,
  onRequestSample,
  isLoading 
}: ProductActionsProps) => {
  const [showPackDialog, setShowPackDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSelectProduct = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to select products.",
      });
      return;
    }

    // Fetch user's projects
    const { data: userProjects, error: projectsError } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id);

    if (projectsError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load projects. Please try again.",
      });
      return;
    }

    // Check if user has any projects with enough points
    const availableProjects = userProjects?.filter(
      project => (project.points - (project.points_used || 0)) >= 1000
    ) || [];

    if (availableProjects.length === 0) {
      setShowPackDialog(true);
    } else {
      setProjects(availableProjects);
      setShowProjectDialog(true);
    }
  };

  const handleProjectSelection = async (projectId: string) => {
    try {
      // Add product to project
      const { error: projectError } = await supabase
        .from('project_products')
        .insert({
          project_id: projectId,
          product_id: productId,
        });

      if (projectError) throw projectError;

      // Update project points using a direct update
      const { error: pointsError } = await supabase
        .from('projects')
        .update({ 
          points_used: supabase.rpc('increment', { x: 1000 })
        })
        .eq('id', projectId)
        .select()
        .single();

      if (pointsError) throw pointsError;

      toast({
        title: "Success",
        description: "Product selected successfully. 1000 points used.",
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

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      <Button 
        variant="outline" 
        className="flex-1 text-primary hover:text-primary border-primary hover:bg-primary/10"
        onClick={onRequestSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Request Sample"}
      </Button>
      <Button 
        className="flex-1 bg-primary hover:bg-primary-dark text-white"
        onClick={handleSelectProduct}
        disabled={isLoading}
      >
        Select Product
      </Button>

      <PackSelectionDialog 
        open={showPackDialog} 
        onOpenChange={setShowPackDialog} 
      />
      
      <ProjectSelectionDialog 
        open={showProjectDialog}
        onOpenChange={setShowProjectDialog}
        projects={projects}
        onConfirm={handleProjectSelection}
      />
    </div>
  );
};

export default ProductActions;