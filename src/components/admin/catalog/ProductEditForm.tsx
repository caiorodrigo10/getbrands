import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BasicInformationSection } from "./product-form/BasicInformationSection";
import { MediaSection } from "./product-form/MediaSection";
import { PricingSection } from "./product-form/PricingSection";
import { OrganizationSection } from "./product-form/OrganizationSection";

const productFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  from_price: z.number().min(0, "Price must be positive"),
  srp: z.number().min(0, "SRP must be positive"),
  is_new: z.boolean().default(false),
  is_tiktok: z.boolean().default(false),
});

interface ProductEditFormProps {
  product: Product;
  onSubmit: (data: Product) => void;
  onCancel: () => void;
}

export function ProductEditForm({ product, onSubmit, onCancel }: ProductEditFormProps) {
  const form = useForm<z.infer<typeof productFormSchema>>({
    resolver: zodResolver(productFormSchema),
    defaultValues: {
      name: product.name,
      category: product.category,
      description: product.description || "",
      from_price: product.from_price,
      srp: product.srp,
      is_new: product.is_new || false,
      is_tiktok: product.is_tiktok || false,
    },
  });

  const { data: productImages, refetch: refetchImages } = useQuery({
    queryKey: ['product-images', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position');

      if (error) throw error;
      return data;
    },
  });

  const handleSubmit = (values: z.infer<typeof productFormSchema>) => {
    onSubmit({
      ...product,
      ...values,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-8">
        <BasicInformationSection form={form} />
        <MediaSection 
          productId={product.id}
          images={productImages || []}
          onImagesUpdate={() => refetchImages()}
        />
        <PricingSection form={form} />
        <OrganizationSection form={form} />

        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            Save Changes
          </Button>
        </div>
      </form>
    </Form>
  );
}