import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { ProductFormSection } from "../ProductFormSection";
import { UseFormReturn } from "react-hook-form";

interface OrganizationSectionProps {
  form: UseFormReturn<any>;
}

export const OrganizationSection = ({ form }: OrganizationSectionProps) => {
  return (
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
  );
};