import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";

interface ProductActionsProps {
  product: Product;
  onSelectProduct?: () => void;
}

export const ProductActions = ({ product, onSelectProduct }: ProductActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [showInsufficientPointsDialog, setShowInsufficientPointsDialog] = useState(false);
  const [showPermissionDeniedDialog, setShowPermissionDeniedDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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
      navigate("/checkout/confirmation");
    } catch (error) {
      console.error('Error adding product to cart:', error);
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
    const isPrivilegedRole = userRole === "admin" || userRole === "customer";

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

      if (!userProjects?.length) {
        navigate("/checkout/points");
        return;
      }

      // Filter projects with sufficient points
      const projectsWithSufficientPoints = userProjects.filter(project => {
        const availablePoints = (project.points || 0) - (project.points_used || 0);
        return availablePoints >= 1000;
      });

      if (isRestrictedRole) {
        setShowPermissionDeniedDialog(true);
        return;
      }

      if (isPrivilegedRole) {
        if (projectsWithSufficientPoints.length > 0) {
          setProjects(projectsWithSufficientPoints);
          setShowProjectDialog(true);
        } else {
          setShowInsufficientPointsDialog(true);
        }
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
        }
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
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 px-4 sm:px-0">
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

      <Dialog open={showInsufficientPointsDialog} onOpenChange={setShowInsufficientPointsDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Insufficient Points</DialogTitle>
            <DialogDescription>
              You don't have enough points to select this product.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Button 
              className="w-full"
              onClick={handleScheduleCall}
            >
              <CalendarDays className="mr-2 h-4 w-4" />
              Schedule a Call with Our Team
            </Button>
            <Button 
              variant="outline" 
              className="w-full"
              onClick={() => setShowInsufficientPointsDialog(false)}
            >
              Cancel
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showPermissionDeniedDialog} onOpenChange={setShowPermissionDeniedDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Permission Denied</DialogTitle>
            <DialogDescription>
              Users with this profile don't have permission to select products.
            </DialogDescription>
          </DialogHeader>
          <Button 
            variant="outline" 
            className="w-full"
            onClick={() => setShowPermissionDeniedDialog(false)}
          >
            Close
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};