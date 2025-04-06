
import React, { useEffect } from "react";
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

  // Initialize the billing checkbox once
  useEffect(() => {
    // Only initialize the billing checkbox if it hasn't been set already
    if (form.getValues("useSameForBilling") === undefined) {
      form.setValue("useSameForBilling", true);
      console.log("Set initial useSameForBilling value to true");
    }

    // Check if address was previously saved
    const wasAddressSaved = localStorage.getItem('addressSaved') === 'true';
    if (wasAddressSaved) {
      setIsAddressSaved(true);
    }
  }, [form, setIsAddressSaved]);

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

    // If not using same address for billing, validate billing fields
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

    // Copy shipping address to billing if using same address
    if (useSameForBilling) {
      form.setValue("billingAddress1", values.address1);
      form.setValue("billingAddress2", values.address2 || "");
      form.setValue("billingCity", values.city);
      form.setValue("billingState", values.state);
      form.setValue("billingZipCode", values.zipCode);
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
    localStorage.setItem('addressSaved', 'true');

    // Store billing address
    localStorage.setItem('billing_address', values.billingAddress1 || '');
    localStorage.setItem('billing_address2', values.billingAddress2 || '');
    localStorage.setItem('billing_city', values.billingCity || '');
    localStorage.setItem('billing_state', values.billingState || '');
    localStorage.setItem('billing_zip', values.billingZipCode || '');

    try {
      await onSubmit(values);
      setIsAddressSaved(true);
      console.log("Address saved successfully, isAddressSaved set to true");
      
      toast({
        title: "Success",
        description: "Address saved successfully! You can now continue to payment.",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save address. Please try again.",
      });
    }
  };

  console.log("Current form values:", form.getValues());
  console.log("isAddressSaved:", isAddressSaved);

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
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
