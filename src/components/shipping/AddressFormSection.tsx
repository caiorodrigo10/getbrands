import React from "react";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { Checkbox } from "@/components/ui/checkbox";
import { ShippingButtons } from "@/components/checkout/ShippingButtons";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";
import { BillingAddressFields } from "@/components/shipping/BillingAddressFields";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleSubmit = async () => {
    const values = form.getValues();
    const isValid = await form.trigger();

    if (!isValid) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please fill in all required fields for both shipping and billing addresses.",
      });
      return;
    }

    // If not using same billing address, validate billing fields
    if (!useSameForBilling) {
      const hasBillingFields = values.billingAddress1 && 
                              values.billingCity && 
                              values.billingState && 
                              values.billingZipCode;
      
      if (!hasBillingFields) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Please fill in all required billing address fields.",
        });
        return;
      }
    }

    await onSubmit(values);
    setIsAddressSaved(true);
  };

  React.useEffect(() => {
    // Pre-fill useSameForBilling as true by default
    form.setValue("useSameForBilling", true);
  }, [form]);

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
              if (checked) {
                // Copy shipping address to billing address
                const values = form.getValues();
                form.setValue("billingAddress1", values.address1);
                form.setValue("billingAddress2", values.address2);
                form.setValue("billingCity", values.city);
                form.setValue("billingState", values.state);
                form.setValue("billingZipCode", values.zipCode);
              } else {
                // Clear billing address fields
                form.setValue("billingAddress1", "");
                form.setValue("billingAddress2", "");
                form.setValue("billingCity", "");
                form.setValue("billingState", "");
                form.setValue("billingZipCode", "");
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

        {!useSameForBilling && (
          <BillingAddressFields form={form} />
        )}

        <ShippingButtons
          isAddressSaved={isAddressSaved}
          onCancel={onCancel}
          onContinue={onContinue}
          onSave={handleSubmit}
        />
      </form>
    </Form>
  );
};