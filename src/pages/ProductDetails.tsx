import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { trackEvent } from "@/lib/analytics";
import { Skeleton } from "@/components/ui/skeleton";
import ProjectSelectionDialog from "@/components/dialogs/ProjectSelectionDialog";
import { ProductHeader } from "@/components/products/ProductHeader";
import { ProductBenefits } from "@/components/products/ProductBenefits";
import { ProductCalculator } from "@/components/products/ProductCalculator";
import { ProductDetailsHeader } from "@/components/products/ProductDetailsHeader";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showProjectDialog, setShowProjectDialog] = useState(false);
  const [projects, setProjects] = useState<any[]>([]);
  const { toast } = useToast();

  const { data: product, isLoading: productLoading } = useQuery({
    queryKey: ["product", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Get product images
  const { data: productImages } = useQuery({
    queryKey: ['product-images', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', id)
        .order('position');

      if (error) throw error;
      return data || [];
    },
    enabled: !!id,
  });

  useEffect(() => {
    if (product) {
      // Enhanced product view tracking with more details
      trackEvent("Product Viewed", {
        product_id: product.id,
        product_name: product.name,
        product_category: product.category,
        price_range: {
          from: product.from_price,
          srp: product.srp
        },
        profit_margin: product.srp - product.from_price,
        is_new: product.is_new,
        is_tiktok: product.is_tiktok,
        description: product.description,
        main_image_url: product.image_url,
        gallery_images: productImages?.map(img => ({
          url: img.image_url,
          is_primary: img.is_primary,
          position: img.position
        })),
        created_at: product.created_at,
        updated_at: product.updated_at,
        total_images: productImages?.length || 0
      });
    }
  }, [product, productImages]);

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
      .eq('user_id', user.id);

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
      navigate("/checkout/points");
    } else {
      setProjects(availableProjects);
      setShowProjectDialog(true);
    }
  };

  const handleProjectSelection = async (projectId: string) => {
    try {
      const { data: existingProduct, error: checkError } = await supabase
        .from('project_products')
        .select('*')
        .eq('project_id', projectId)
        .eq('product_id', id)
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
          product_id: id
        });

      if (insertError) throw insertError;

      // Track product selection event
      trackEvent("Product Selected", {
        product_id: id,
        product_name: product?.name,
        product_category: product?.category,
        project_id: projectId,
        project_name: currentProject.name
      });

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

  if (productLoading) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-[400px] w-full" />
        <div className="space-y-4">
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-20 w-full" />
        </div>
      </div>
    );
  }

  if (!product) return null;

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-6 py-4">
      <ProductDetailsHeader />
      
      <ProductHeader 
        product={product} 
        onSelectProduct={handleSelectProduct}
      />
      
      <div className="mt-16">
        <ProductBenefits product={product} />
      </div>

      <div className="mt-16">
        <ProductCalculator product={product} />
      </div>

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

export default ProductDetails;