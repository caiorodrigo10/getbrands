import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { AddressSelectionSection } from "@/components/shipping/AddressSelectionSection";
import { AddressFormSection } from "@/components/shipping/AddressFormSection";
import type { ShippingFormData, Address } from "@/types/shipping";
import { useShippingForm } from "@/hooks/useShippingForm";

const Shipping = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedAddressId, setSelectedAddressId] = React.useState<string | null>(null);
  const [isAddressSaved, setIsAddressSaved] = React.useState(false);
  const form = useShippingForm();

  const { data: addresses } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();

      const { data: addressData, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      if (profileData) {
        form.setValue("firstName", profileData.first_name || "");
        form.setValue("lastName", profileData.last_name || "");
      }

      return addressData.map(addr => ({
        ...addr,
        type: addr.type as Address['type']
      })) as Address[];
    },
    enabled: !!user?.id,
  });

  const handleCancel = () => {
    navigate("/checkout/cart");
  };

  const handleContinue = () => {
    if (isAddressSaved) {
      navigate("/checkout/payment");
    }
  };

  const saveAddress = async (values: ShippingFormData) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");

      // Update profile with first and last name
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
        .upsert({
          user_id: user.id,
          street_address1: values.address1,
          street_address2: values.address2,
          city: values.city,
          state: values.state,
          zip_code: values.zipCode,
          type: values.useSameForBilling ? 'both' : 'shipping',
        });

      if (addressError) throw addressError;

      // Save billing address if different
      if (!values.useSameForBilling) {
        const { error: billingAddressError } = await supabase
          .from("addresses")
          .upsert({
            user_id: user.id,
            street_address1: values.billingAddress1!,
            street_address2: values.billingAddress2,
            city: values.billingCity!,
            state: values.billingState!,
            zip_code: values.billingZipCode!,
            type: 'billing',
          });

        if (billingAddressError) throw billingAddressError;
      }

      toast({
        title: "Success",
        description: "Address saved successfully",
      });

      setIsAddressSaved(true);
    } catch (error) {
      console.error("Error saving address:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to save address. Please try again.",
      });
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
        
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
          onCancel={handleCancel}
          onContinue={handleContinue}
        />
      </div>
    </div>
  );
};

export default Shipping;
