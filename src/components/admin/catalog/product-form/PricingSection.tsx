import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ProductFormSection } from "../ProductFormSection";
import { UseFormReturn } from "react-hook-form";

interface PricingSectionProps {
  form: UseFormReturn<any>;
}

export const PricingSection = ({ form }: PricingSectionProps) => {
  return (
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
  );
};