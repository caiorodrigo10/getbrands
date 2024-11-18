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

  // First, fetch the project product with its related data
  const { data: projectProduct, isLoading: isLoadingProduct } = useQuery({
    queryKey: ["project-product-details", productId],
    queryFn: async () => {
      // Get the project product details
      const { data: projectProductData, error: projectProductError } = await supabase
        .from("project_products")
        .select(`
          id,
          product_id,
          project_id,
          product:products (
            id,
            name,
            category,
            from_price,
            srp,
            image_url
          )
        `)
        .eq("id", productId)
        .single();

      if (projectProductError) throw projectProductError;

      // Get any specific product data
      const { data: specificData } = await supabase
        .from("project_specific_products")
        .select("*")
        .eq("project_product_id", productId)
        .order('created_at', { ascending: false })
        .limit(1);

      // Get the most recent specific product data if it exists
      const specificProduct = specificData && specificData.length > 0 ? specificData[0] : null;

      return {
        projectProduct: projectProductData,
        baseProduct: projectProductData.product,
        specificProduct: specificProduct
      };
    },
  });

  // Update form when data is loaded
  useQuery({
    queryKey: ["update-form", projectProduct],
    enabled: !!projectProduct,
    queryFn: () => {
      if (!projectProduct) return null;

      const name = projectProduct.specificProduct?.name || projectProduct.baseProduct.name;
      const price = projectProduct.specificProduct?.selling_price || projectProduct.baseProduct.srp;

      form.reset({
        name,
        selling_price: price,
      });
      return null;
    },
  });

  const { data: productImages, refetch: refetchImages } = useQuery({
    queryKey: ['project-product-images', productId],
    enabled: !!projectProduct,
    queryFn: async () => {
      if (!projectProduct?.specificProduct?.images) {
        // If no specific images, fetch the base product images
        const { data, error } = await supabase
          .from('product_images')
          .select('*')
          .eq('product_id', projectProduct?.baseProduct.id)
          .order('position');

        if (error) throw error;
        return data || [];
      }

      // Use specific product images if available
      const images = projectProduct.specificProduct.images || [];
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

  if (isLoadingProduct) {
    return (
      <div className="p-6">
        <div className="h-8 w-64 bg-gray-200 animate-pulse rounded" />
      </div>
    );
  }

  if (!projectProduct) return null;

  const mainImageUrl = projectProduct.specificProduct?.main_image_url || 
                      projectProduct.baseProduct.image_url;

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
        mainImageUrl={mainImageUrl}
        onImagesUpdate={() => refetchImages()}
        onSubmit={handleSubmit}
      />
    </div>
  );
};

export default ProjectProductEdit;