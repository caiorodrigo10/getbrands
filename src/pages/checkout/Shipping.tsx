import React from "react";
import { useNavigate } from "react-router-dom";
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

  const { data: addresses, refetch: refetchAddresses } = useQuery({
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

      // Restore form data from localStorage if available
      const savedFirstName = localStorage.getItem('firstName');
      const savedLastName = localStorage.getItem('lastName');
      const savedPhone = localStorage.getItem('phone');
      const savedAddress = localStorage.getItem('shipping_address');
      const savedCity = localStorage.getItem('shipping_city');
      const savedState = localStorage.getItem('shipping_state');
      const savedZip = localStorage.getItem('shipping_zip');

      if (savedFirstName) form.setValue("firstName", savedFirstName);
      if (savedLastName) form.setValue("lastName", savedLastName);
      if (savedPhone) form.setValue("phone", savedPhone);
      if (savedAddress) form.setValue("address1", savedAddress);
      if (savedCity) form.setValue("city", savedCity);
      if (savedState) form.setValue("state", savedState);
      if (savedZip) form.setValue("zipCode", savedZip);

      return addressData.map(addr => ({
        ...addr,
        type: addr.type as Address['type']
      })) as Address[];
    },
    enabled: !!user?.id,
  });

  React.useEffect(() => {
    if (addresses && addresses.length > 0 && !selectedAddressId) {
      const lastAddress = addresses[0];
      const currentValues = form.getValues();
      
      // Only set address values if there's no data in localStorage
      if (!localStorage.getItem('shipping_address')) {
        form.reset({
          ...currentValues,
          address1: lastAddress.street_address1,
          address2: lastAddress.street_address2 || "",
          city: lastAddress.city,
          state: lastAddress.state,
          zipCode: lastAddress.zip_code,
          useSameForBilling: true,
        });
      }
      
      setSelectedAddressId(lastAddress.id);
      setIsAddressSaved(true);
    }
  }, [addresses, selectedAddressId]);

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

      // Save shipping address with first/last name
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

      // Save form data to localStorage for payment processing
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
          setIsAddressSaved={setIsAddressSaved}
        />
      </div>
    </div>
  );
};

export default Shipping;