import React from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { AddressSelectionSection } from "./AddressSelectionSection";
import { AddressFormSection } from "./AddressFormSection";
import type { ShippingFormData, Address } from "@/types/shipping";
import type { UseFormReturn } from "react-hook-form";
import type { User } from "@supabase/supabase-js";

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
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [isAddressSaved, setIsAddressSaved] = React.useState(false);

  const { data: addresses, refetch: refetchAddresses } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      
      // Get user profile data
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      // Get addresses
      const { data: addressData, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Set form values from localStorage or profile
      const savedData = {
        firstName: localStorage.getItem('firstName') || profileData?.first_name || "",
        lastName: localStorage.getItem('lastName') || profileData?.last_name || "",
        phone: localStorage.getItem('phone') || "",
        address1: localStorage.getItem('shipping_address') || "",
        city: localStorage.getItem('shipping_city') || "",
        state: localStorage.getItem('shipping_state') || "",
        zipCode: localStorage.getItem('shipping_zip') || "",
      };

      form.reset({
        ...form.getValues(),
        ...savedData
      });

      return addressData as Address[];
    },
    enabled: !!user?.id,
  });

  const saveAddress = async (values: ShippingFormData) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");

      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: values.firstName,
          last_name: values.lastName,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Save shipping address
      const { error: addressError } = await supabase
        .from("addresses")
        .insert({
          user_id: user.id,
          first_name: values.firstName,
          last_name: values.lastName,
          street_address1: values.address1,
          street_address2: values.address2,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          type: values.useSameForBilling ? 'both' : 'shipping',
          used_in_order: true
        })
        .select()
        .single();

      if (addressError) throw addressError;

      // Save billing address if different
      if (!values.useSameForBilling && values.billingAddress1) {
        const { error: billingAddressError } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            first_name: values.firstName,
            last_name: values.lastName,
            street_address1: values.billingAddress1,
            street_address2: values.billingAddress2,
            city: values.billingCity!,
            state: values.billingState!,
            zip_code: values.billingZipCode!,
            type: 'billing',
          });

        if (billingAddressError) throw billingAddressError;
      }

      // Save to localStorage
      localStorage.setItem('firstName', values.firstName);
      localStorage.setItem('lastName', values.lastName);
      localStorage.setItem('phone', values.phone);
      localStorage.setItem('shipping_address', values.address1);
      localStorage.setItem('shipping_city', values.city);
      localStorage.setItem('shipping_state', values.state);
      localStorage.setItem('shipping_zip', values.zipCode);

      await refetchAddresses();
      setIsAddressSaved(true);

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