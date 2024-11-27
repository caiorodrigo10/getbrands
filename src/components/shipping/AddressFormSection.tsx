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
        description: "Please fill in all required fields for shipping address.",
      });
      return;
    }

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

    // Store billing preference in localStorage
    localStorage.setItem('useSameForBilling', useSameForBilling.toString());

    // If using same address for billing, copy shipping address values
    if (useSameForBilling) {
      localStorage.setItem('billing_address', values.address1);
      localStorage.setItem('billing_address2', values.address2 || '');
      localStorage.setItem('billing_city', values.city);
      localStorage.setItem('billing_state', values.state);
      localStorage.setItem('billing_zip', values.zipCode);
    } else {
      // Store separate billing address
      localStorage.setItem('billing_address', values.billingAddress1 || '');
      localStorage.setItem('billing_address2', values.billingAddress2 || '');
      localStorage.setItem('billing_city', values.billingCity || '');
      localStorage.setItem('billing_state', values.billingState || '');
      localStorage.setItem('billing_zip', values.billingZipCode || '');
    }

    await onSubmit(values);
    setIsAddressSaved(true);
  };

  React.useEffect(() => {
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
                const values = form.getValues();
                form.setValue("billingAddress1", values.address1);
                form.setValue("billingAddress2", values.address2);
                form.setValue("billingCity", values.city);
                form.setValue("billingState", values.state);
                form.setValue("billingZipCode", values.zipCode);
              } else {
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