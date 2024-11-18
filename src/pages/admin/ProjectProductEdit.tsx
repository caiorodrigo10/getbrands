import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { ProductFormSection } from "@/components/admin/catalog/ProductFormSection";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProductImageUpload } from "@/components/admin/catalog/ProductImageUpload";
import { ProductImage } from "@/types/product";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  selling_price: z.number().min(0, "Price must be positive"),
});

const ProjectProductEdit = () => {
  const { projectId, productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: projectProduct, isLoading } = useQuery({
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
      })) as ProductImage[];
    },
    enabled: !!projectProduct,
  });

  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: projectProduct?.specific?.[0]?.name || projectProduct?.product?.name || "",
      selling_price: projectProduct?.specific?.[0]?.selling_price || projectProduct?.product?.srp || 0,
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

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
          <ProductFormSection title="Media">
            <ProductImageUpload
              productId={productId || ""}
              images={productImages || []}
              mainImageUrl={projectProduct.specific?.[0]?.main_image_url || projectProduct.product?.image_url}
              onImagesUpdate={() => refetchImages()}
            />
          </ProductFormSection>

          <ProductFormSection title="Product Information">
            <div className="grid gap-6 max-w-xl">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="selling_price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Selling Price</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        step="0.01"
                        onChange={e => field.onChange(parseFloat(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </ProductFormSection>

          <div className="flex justify-end gap-4 pt-6 border-t">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => navigate(`/admin/projects/${projectId}/manage`)}
            >
              Cancel
            </Button>
            <Button type="submit">
              Save Changes
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProjectProductEdit;