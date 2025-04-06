
import React, { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AddressSelectionSection } from "./AddressSelectionSection";
import { AddressFormSection } from "./AddressFormSection";
import type { ShippingFormData, Address } from "@/types/shipping";
import type { UseFormReturn } from "react-hook-form";
import type { User } from "@supabase/auth-helpers-react";

interface ShippingFormContainerProps {
  user: User;
  form: UseFormReturn<ShippingFormData>;
  onCancel: () => void;
  onContinue: () => void;
  toast: any;
}

export const ShippingFormContainer = ({
  user,
  form,
  onCancel,
  onContinue,
  toast,
}: ShippingFormContainerProps) => {
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressSaved, setIsAddressSaved] = useState(false);
  const [initialFormPopulated, setInitialFormPopulated] = useState(false);

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name, phone")
        .eq("id", user.id)
        .single();

      const { data: addressData, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .eq("used_in_order", true)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Only populate form with profile data if form is empty and not already populated
      if (!initialFormPopulated) {
        const currentValues = form.getValues();
        const isEmpty = !currentValues.firstName && !currentValues.lastName;
        
        if (isEmpty && profileData) {
          console.log("Populating form with profile data");
          form.setValue("firstName", profileData.first_name || "");
          form.setValue("lastName", profileData.last_name || "");
          form.setValue("phone", profileData.phone || "");
          setInitialFormPopulated(true);
        }
      }

      return addressData as Address[];
    },
    enabled: !!user?.id,
  });

  // Check if address was saved on mount
  useEffect(() => {
    const savedStatus = localStorage.getItem('addressSaved') === 'true';
    setIsAddressSaved(savedStatus);
  }, []);

  const saveAddress = async (values: ShippingFormData) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");

      localStorage.setItem('firstName', values.firstName);
      localStorage.setItem('lastName', values.lastName);
      localStorage.setItem('phone', values.phone);
      localStorage.setItem('shipping_address', values.address1);
      localStorage.setItem('shipping_address2', values.address2 || '');
      localStorage.setItem('shipping_city', values.city);
      localStorage.setItem('shipping_state', values.state);
      localStorage.setItem('shipping_zip', values.zipCode);

      if (!values.useSameForBilling) {
        localStorage.setItem('billing_address', values.billingAddress1 || '');
        localStorage.setItem('billing_address2', values.billingAddress2 || '');
        localStorage.setItem('billing_city', values.billingCity || '');
        localStorage.setItem('billing_state', values.billingState || '');
        localStorage.setItem('billing_zip', values.billingZipCode || '');
      }

      const { error } = await supabase
        .from('addresses')
        .insert({
          user_id: user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          street_address1: values.address1,
          street_address2: values.address2,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          type: 'shipping',
          phone: values.phone,
          used_in_order: false
        });

      if (error) throw error;
      
      setIsAddressSaved(true);
      localStorage.setItem('addressSaved', 'true');
      toast({
        title: "Success",
        description: "Address saved successfully",
      });
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save address. Please try again.",
      });
      throw error;
    }
  };

  return (
    <>
      <AddressSelectionSection
        user={user}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        form={form}
        setSelectedAddressId={setSelectedAddressId}
      />

      <AddressFormSection
        form={form}
        isAddressSaved={isAddressSaved}
        onSubmit={saveAddress}
        onCancel={onCancel}
        onContinue={onContinue}
        setIsAddressSaved={setIsAddressSaved}
      />
    </>
  );
};
