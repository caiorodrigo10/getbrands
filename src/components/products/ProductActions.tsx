import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/hooks/use-toast";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
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
  const navigate = useNavigate();
  
  // Define a single state for controlling dialogs
  type DialogState = "project" | "insufficientPoints" | "permissionDenied" | null;
  const [currentDialog, setCurrentDialog] = useState<DialogState>(null);
  const [projects, setProjects] = useState<any[]>([]);

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

    const userRole = user?.role;
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
        setCurrentDialog("permissionDenied");
        return;
      }

      // Filter projects with sufficient points
      const projectsWithSufficientPoints = userProjects?.filter(project => {
        const availablePoints = (project.points || 0) - (project.points_used || 0);
        return availablePoints >= 1000;
      }) || [];

      // Clear any existing dialog state
      setCurrentDialog(null);

      if (projectsWithSufficientPoints.length > 0) {
        setProjects(projectsWithSufficientPoints);
        setCurrentDialog("project");
      } else {
        setCurrentDialog("insufficientPoints");
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
          open={currentDialog === "project"}
          onOpenChange={(open) => !open && setCurrentDialog(null)}
          projects={projects}
          onConfirm={handleProjectSelection}
          product={product}
        />
      )}

      <InsufficientPointsDialog
        open={currentDialog === "insufficientPoints"}
        onOpenChange={(open) => !open && setCurrentDialog(null)}
        onScheduleCall={handleScheduleCall}
      />

      <PermissionDeniedDialog
        open={currentDialog === "permissionDenied"}
        onOpenChange={(open) => !open && setCurrentDialog(null)}
      />
    </div>
  );
};

export default ProductActions;