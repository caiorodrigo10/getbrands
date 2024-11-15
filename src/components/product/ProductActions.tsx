import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import PackSelectionDialog from "../dialogs/PackSelectionDialog";
import ProjectSelectionDialog from "../dialogs/ProjectSelectionDialog";
import { Product } from "@/types/product";

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
  const [product, setProduct] = useState<Product | null>(null);
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleSelectProduct = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to select products.",
      });
      return;
    }

    // Fetch product details
    const { data: productData, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (productError) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load product details. Please try again.",
      });
      return;
    }

    setProduct(productData);

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
      // First check if product already exists in project
      const { data: existingProduct, error: checkError } = await supabase
        .from('project_products')
        .select('*')
        .eq('project_id', projectId)
        .eq('product_id', productId)
        .maybeSingle();

      if (existingProduct) {
        toast({
          variant: "destructive",
          title: "Product already selected",
          description: "This product is already in your project.",
        });
        return;
      }

      // Get current project points
      const { data: currentProject, error: projectError } = await supabase
        .from('projects')
        .select('points_used, name')
        .eq('id', projectId)
        .single();

      if (projectError) throw projectError;

      // Update project points (add 1000 to points_used)
      const newPointsUsed = (currentProject?.points_used || 0) + 1000;
      const { error: updateError } = await supabase
        .from('projects')
        .update({ points_used: newPointsUsed })
        .eq('id', projectId);

      if (updateError) throw updateError;

      // Add product to project
      const { error: insertError } = await supabase
        .from('project_products')
        .insert({
          project_id: projectId,
          product_id: productId
        });

      if (insertError) throw insertError;

      // Close dialog and navigate to success page
      setShowProjectDialog(false);
      
      // Navigate to success page with product and project info
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
        replace: true // Use replace to prevent back navigation to this state
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
      
      {product && (
        <ProjectSelectionDialog 
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          projects={projects}
          onConfirm={handleProjectSelection}
          product={product}
        />
      )}
    </div>
  );
};

export default ProductActions;