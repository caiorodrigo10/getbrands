import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { UseFormReturn } from "react-hook-form";
import type { ShippingFormData } from "@/types/shipping";
import { US_STATES } from "@/lib/constants";

interface AddressFieldsProps {
  form: UseFormReturn<ShippingFormData>;
  prefix?: string;
  formFields?: {
    address1: keyof ShippingFormData;
    address2: keyof ShippingFormData;
    city: keyof ShippingFormData;
    state: keyof ShippingFormData;
    zipCode: keyof ShippingFormData;
  };
}

export const AddressFields = ({ form, prefix = "", formFields }: AddressFieldsProps) => {
  const fields = formFields || {
    address1: "address1" as keyof ShippingFormData,
    address2: "address2" as keyof ShippingFormData,
    city: "city" as keyof ShippingFormData,
    state: "state" as keyof ShippingFormData,
    zipCode: "zipCode" as keyof ShippingFormData,
  };

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name={fields.address1}
        render={({ field: { value, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Address Line 1</FormLabel>
            <FormControl>
              <Input {...fieldProps} value={value as string} placeholder="Street address" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name={fields.address2}
        render={({ field: { value, ...fieldProps } }) => (
          <FormItem>
            <FormLabel>Address Line 2 (Optional)</FormLabel>
            <FormControl>
              <Input {...fieldProps} value={value as string} placeholder="Apartment, suite, etc." />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <FormField
          control={form.control}
          name={fields.city}
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>City</FormLabel>
              <FormControl>
                <Input {...fieldProps} value={value as string} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.state}
          render={({ field }) => (
            <FormItem>
              <FormLabel>State</FormLabel>
              <FormControl>
                <Select onValueChange={field.onChange} value={field.value as string}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {US_STATES.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name={fields.zipCode}
          render={({ field: { value, ...fieldProps } }) => (
            <FormItem>
              <FormLabel>ZIP Code</FormLabel>
              <FormControl>
                <Input {...fieldProps} value={value as string} placeholder="12345" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
};

export default AddressFields;