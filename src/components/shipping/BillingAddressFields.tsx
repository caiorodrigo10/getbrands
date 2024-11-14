import { AddressFields } from "@/components/shipping/AddressFields";
import type { UseFormReturn } from "react-hook-form";
import type { ShippingFormData } from "@/types/shipping";

interface BillingAddressFieldsProps {
  form: UseFormReturn<ShippingFormData>;
}

export const BillingAddressFields = ({ form }: BillingAddressFieldsProps) => {
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-lg font-medium mb-4">Billing Address</h3>
      <AddressFields
        form={form}
        formFields={{
          address1: "billingAddress1",
          address2: "billingAddress2",
          city: "billingCity",
          state: "billingState",
          zipCode: "billingZipCode",
        }}
      />
    </div>
  );
};