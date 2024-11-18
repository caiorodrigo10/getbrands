import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProjectProductEditForm } from "@/components/admin/projects/product-edit/ProjectProductEditForm";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  selling_price: z.number().min(0, "Price must be positive"),
});

const ProjectProductEdit = () => {
  const { projectId, productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
  });

  const { data: projectProduct, isLoading, refetch: refetchProduct } = useQuery({
    queryKey: ["project-product", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("project_products")
        .select(`
          id,
          product:products (
            id,
            name,
            category,
            from_price,
            srp,
            image_url
          ),
          specific:project_specific_products (
            id,
            name,
            selling_price,
            main_image_url,
            images
          )
        `)
        .eq("id", productId)
        .single();

      if (error) throw error;
      return data;
    },
  });

  // Update form values when data is loaded
  useQuery({
    queryKey: ["update-form", projectProduct],
    enabled: !!projectProduct,
    queryFn: () => {
      const specificProduct = projectProduct?.specific?.[0];
      const defaultName = specificProduct?.name || projectProduct?.product?.name || "";
      const defaultPrice = specificProduct?.selling_price || projectProduct?.product?.srp || 0;
      
      form.reset({
        name: defaultName,
        selling_price: defaultPrice,
      });
      return null;
    },
  });

  const { data: productImages, refetch: refetchImages } = useQuery({
    queryKey: ['project-product-images', productId],
    queryFn: async () => {
      if (!projectProduct?.specific?.[0]?.images) return [];
      const images = projectProduct.specific[0].images || [];
      return (images as any[]).map((img, index) => ({
        id: img.id || `temp-${index}`,
        product_id: productId as string,
        image_url: img.image_url,
        position: index,
        is_primary: index === 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }));
    },
    enabled: !!projectProduct,
  });

  const handleSubmit = async (values: z.infer<typeof productFormSchema>) => {
    try {
      const { error } = await supabase
        .from("project_specific_products")
        .upsert({
          project_product_id: productId,
          name: values.name,
          selling_price: values.selling_price,
        });

      if (error) throw error;

      await refetchProduct();

      toast({
        title: "Success",
        description: "Product updated successfully",
      });
      
      navigate(`/admin/projects/${projectId}/manage`);
    } catch (error) {
      console.error('Error updating product:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update product",
      });
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!projectProduct) return null;

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="icon"
          onClick={() => navigate(`/admin/projects/${projectId}/manage`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-semibold">Edit Project Product</h1>
          <p className="text-muted-foreground mt-1">
            Customize this product for your project
          </p>
        </div>
      </div>

      <ProjectProductEditForm
        form={form}
        productId={productId || ""}
        projectId={projectId || ""}
        productImages={productImages || []}
        mainImageUrl={projectProduct.specific?.[0]?.main_image_url || projectProduct.product?.image_url}
        onImagesUpdate={() => refetchImages()}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProjectProductEdit;