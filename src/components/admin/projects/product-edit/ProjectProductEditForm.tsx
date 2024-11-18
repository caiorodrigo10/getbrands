import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { ProductFormSection } from "@/components/admin/catalog/ProductFormSection";
import { ProductImageUpload } from "@/components/admin/catalog/ProductImageUpload";
import { ProductImage } from "@/types/product";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

interface ProjectProductEditFormProps {
  form: UseFormReturn<any>;
  productId: string;
  projectId: string;
  productImages: ProductImage[];
  mainImageUrl: string | null;
  onImagesUpdate: () => void;
  onSubmit: (values: any) => void;
}

export const ProjectProductEditForm = ({
  form,
  productId,
  projectId,
  productImages,
  mainImageUrl,
  onImagesUpdate,
  onSubmit
}: ProjectProductEditFormProps) => {
  const navigate = useNavigate();

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <ProductFormSection title="Media">
          <ProductImageUpload
            productId={productId}
            images={productImages}
            mainImageUrl={mainImageUrl}
            onImagesUpdate={onImagesUpdate}
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
  );
};