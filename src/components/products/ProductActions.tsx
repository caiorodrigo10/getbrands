import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";
import { InsufficientPointsDialog } from "./dialogs/InsufficientPointsDialog";
import { PermissionDeniedDialog } from "./dialogs/PermissionDeniedDialog";
import { useProductSelection } from "./hooks/useProductSelection";

interface ProductActionsProps {
  product: Product;
  onSelectProduct?: () => void;
}

export const ProductActions = ({ product, onSelectProduct }: ProductActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const {
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
  } = useProductSelection(product);

  const { data: userProfile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user,
  });

  const handleRequestSample = async () => {
    setIsLoading(true);
    try {
      await addItem(product);
      toast({
        title: "Success",
        description: "Product added to cart successfully.",
      });
    } catch (error) {
      console.error('Error requesting sample:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectProduct = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to select products.",
      });
      return;
    }

    const userRole = userProfile?.role;
    const isRestrictedRole = userRole === "member" || userRole === "sampler";

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

      if (isRestrictedRole) {
        setShowPermissionDeniedDialog(true);
        return;
      }

      // Filter projects with sufficient points
      const projectsWithSufficientPoints = userProjects?.filter(project => {
        const availablePoints = (project.points || 0) - (project.points_used || 0);
        return availablePoints >= 1000;
      }) || [];

      // Reset any previously shown dialogs
      setShowInsufficientPointsDialog(false);
      setShowProjectDialog(false);

      if (projectsWithSufficientPoints.length > 0) {
        setProjects(projectsWithSufficientPoints);
        setShowProjectDialog(true);
      } else {
        setShowInsufficientPointsDialog(true);
      }

      // Call the parent's onSelectProduct if provided
      if (onSelectProduct) {
        onSelectProduct();
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

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 mt-6 px-4 sm:px-0">
      <Button
        variant="outline"
        size="lg"
        className="w-full text-primary hover:text-primary border-2 border-primary hover:bg-primary/10 h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleRequestSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Request Sample"}
      </Button>
      <Button
        size="lg"
        className="w-full bg-primary hover:bg-primary-dark text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleSelectProduct}
      >
        Select Product
      </Button>

      {product && (
        <ProjectSelectionDialog
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          projects={projects}
          onConfirm={handleProjectSelection}
          product={product}
        />
      )}

      <InsufficientPointsDialog
        open={showInsufficientPointsDialog}
        onOpenChange={setShowInsufficientPointsDialog}
        onScheduleCall={handleScheduleCall}
      />

      <PermissionDeniedDialog
        open={showPermissionDeniedDialog}
        onOpenChange={setShowPermissionDeniedDialog}
      />
    </div>
  );
};

export default ProductActions;