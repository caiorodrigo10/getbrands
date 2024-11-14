import React from "react";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { Checkbox } from "@/components/ui/checkbox";
import { ShippingButtons } from "@/components/checkout/ShippingButtons";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";

interface AddressFormSectionProps {
  form: UseFormReturn<ShippingFormData>;
  isAddressSaved: boolean;
  onSubmit: (values: ShippingFormData) => Promise<void>;
  onCancel: () => void;
  onContinue: () => void;
  setIsAddressSaved: (value: boolean) => void;
}

export const AddressFormSection = ({
  form,
  isAddressSaved,
  onSubmit,
  onCancel,
  onContinue,
  setIsAddressSaved,
}: AddressFormSectionProps) => {
  const useSameForBilling = form.watch("useSameForBilling");
  const formValues = form.getValues();

  // Check if form has all required fields filled
  const isFormComplete = React.useMemo(() => {
    return !!(
      formValues.firstName &&
      formValues.lastName &&
      formValues.address1 &&
      formValues.city &&
      formValues.state &&
      formValues.zipCode &&
      formValues.phone
    );
  }, [formValues]);

  // Set isAddressSaved to true if form is complete on mount
  React.useEffect(() => {
    if (isFormComplete) {
      setIsAddressSaved(true);
    }
  }, [isFormComplete, setIsAddressSaved]);

  const handleSubmit = async () => {
    const values = form.getValues();
    await onSubmit(values);
    setIsAddressSaved(true);
  };

  return (
    <Form {...form}>
      <form className="space-y-6">
        <PersonalInfoFields form={form} />
        <AddressFields form={form} />
        <ContactFields form={form} />

        <div className="flex items-center space-x-2">
          <Checkbox
            id="useSameForBilling"
            checked={useSameForBilling}
            onCheckedChange={(checked) => {
              form.setValue("useSameForBilling", checked as boolean);
              if (!checked) {
                setIsAddressSaved(false);
              }
            }}
          />
          <label
            htmlFor="useSameForBilling"
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
          >
            Use same address for billing
          </label>
        </div>

        <ShippingButtons
          isAddressSaved={isAddressSaved || isFormComplete}
          onCancel={onCancel}
          onContinue={onContinue}
          onSave={handleSubmit}
        />
      </form>
    </Form>
  );
};