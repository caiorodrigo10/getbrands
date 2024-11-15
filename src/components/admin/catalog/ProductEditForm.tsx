import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Product } from "@/types/product";
import { ProductImageUpload } from "./ProductImageUpload";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ProductFormSection } from "./ProductFormSection";
import { RichTextEditor } from "./RichTextEditor";

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
        <ProductFormSection title="Media">
          <ProductImageUpload
            productId={product.id}
            images={productImages || []}
            onImagesUpdate={() => refetchImages()}
          />
        </ProductFormSection>

        <ProductFormSection 
          title="Basic Information"
          description="Add the basic product information"
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <RichTextEditor value={field.value || ""} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </ProductFormSection>

        <ProductFormSection 
          title="Pricing"
          description="Set the product pricing information"
        >
          <div className="grid gap-6 sm:grid-cols-2 max-w-xl">
            <FormField
              control={form.control}
              name="from_price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>From Price</FormLabel>
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

            <FormField
              control={form.control}
              name="srp"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SRP</FormLabel>
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

        <ProductFormSection 
          title="Organization"
          description="Organize and categorize the product"
        >
          <div className="grid gap-6">
            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <Input {...field} className="max-w-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-6">
              <FormField
                control={form.control}
                name="is_new"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">New Product</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="is_tiktok"
                render={({ field }) => (
                  <FormItem className="flex items-center space-x-2">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="!mt-0">TikTok Product</FormLabel>
                  </FormItem>
                )}
              />
            </div>
          </div>
        </ProductFormSection>

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