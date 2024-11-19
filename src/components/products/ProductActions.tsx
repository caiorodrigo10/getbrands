import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import NoPointsDialog from "@/components/dialogs/NoPointsDialog";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";

interface ProductActionsProps {
  product: Product;
  onSelectProduct?: () => void;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showNoPointsDialog, setShowNoPointsDialog] = useState(false);
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();

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

    const availableProjects = userProjects?.filter(
      project => (project.points - (project.points_used || 0)) >= 1000
    ) || [];

    if (availableProjects.length === 0) {
      setShowNoPointsDialog(true);
    } else {
      setProjects(availableProjects);
      setShowProjectDialog(true);
    }
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

      <NoPointsDialog 
        open={showNoPointsDialog} 
        onOpenChange={setShowNoPointsDialog} 
      />

      {product && (
        <ProjectSelectionDialog 
          open={showProjectDialog}
          onOpenChange={setShowProjectDialog}
          projects={projects}
          onConfirm={(projectId) => {
            // This function is already implemented in the parent component
            if (onSelectProduct) {
              onSelectProduct();
            }
          }}
          product={product}
        />
      )}
    </div>
  );
};