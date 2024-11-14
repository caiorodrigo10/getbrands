import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { UseFormReturn } from "react-hook-form";
import type { ShippingFormData } from "@/types/shipping";

interface ContactFieldsProps {
  form: UseFormReturn<ShippingFormData>;
}

export const ContactFields = ({ form }: ContactFieldsProps) => {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <Input {...field} type="tel" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};