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

    // Store all form values in localStorage
    localStorage.setItem('firstName', values.firstName);
    localStorage.setItem('lastName', values.lastName);
    localStorage.setItem('phone', values.phone);
    localStorage.setItem('shipping_address', values.address1);
    localStorage.setItem('shipping_address2', values.address2 || '');
    localStorage.setItem('shipping_city', values.city);
    localStorage.setItem('shipping_state', values.state);
    localStorage.setItem('shipping_zip', values.zipCode);
    localStorage.setItem('useSameForBilling', useSameForBilling.toString());

    // Store billing address if different from shipping
    if (!useSameForBilling) {
      localStorage.setItem('billing_address', values.billingAddress1 || '');
      localStorage.setItem('billing_address2', values.billingAddress2 || '');
      localStorage.setItem('billing_city', values.billingCity || '');
      localStorage.setItem('billing_state', values.billingState || '');
      localStorage.setItem('billing_zip', values.billingZipCode || '');
    }

    await onSubmit(values);
    setIsAddressSaved(true);
  };

  // Load saved values from localStorage when component mounts
  React.useEffect(() => {
    const savedValues = {
      firstName: localStorage.getItem('firstName') || '',
      lastName: localStorage.getItem('lastName') || '',
      phone: localStorage.getItem('phone') || '',
      address1: localStorage.getItem('shipping_address') || '',
      address2: localStorage.getItem('shipping_address2') || '',
      city: localStorage.getItem('shipping_city') || '',
      state: localStorage.getItem('shipping_state') || '',
      zipCode: localStorage.getItem('shipping_zip') || '',
      useSameForBilling: localStorage.getItem('useSameForBilling') === 'true',
      billingAddress1: localStorage.getItem('billing_address') || '',
      billingAddress2: localStorage.getItem('billing_address2') || '',
      billingCity: localStorage.getItem('billing_city') || '',
      billingState: localStorage.getItem('billing_state') || '',
      billingZipCode: localStorage.getItem('billing_zip') || '',
    };

    // Only set form values if they're not already set
    if (!form.getValues().firstName) {
      form.reset(savedValues);
    }
  }, [form]);

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