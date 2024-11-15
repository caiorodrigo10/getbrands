import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RichTextEditor } from "../RichTextEditor";
import { ProductFormSection } from "../ProductFormSection";
import { UseFormReturn } from "react-hook-form";

interface BasicInformationSectionProps {
  form: UseFormReturn<any>;
}

export const BasicInformationSection = ({ form }: BasicInformationSectionProps) => {
  return (
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
  );
};