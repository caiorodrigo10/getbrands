import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { SavedAddressSelect } from "@/components/shipping/SavedAddressSelect";
import { ShippingButtons } from "@/components/checkout/ShippingButtons";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import type { ShippingFormData } from "@/types/shipping";

const formSchema = z.object({
  firstName: z.string().min(2, "First name is too short"),
  lastName: z.string().min(2, "Last name is too short"),
  address1: z.string().min(5, "Address is too short"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is too short"),
  state: z.string().min(2, "Invalid state"),
  zipCode: z.string().min(5, "Invalid ZIP code"),
  phone: z.string().min(10, "Invalid phone number"),
  useSameForBilling: z.boolean().default(true),
});

const Shipping = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showAddressSelect, setShowAddressSelect] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isAddressSaved, setIsAddressSaved] = useState(false);

  const { data: addresses } = useQuery({
    queryKey: ["addresses", user?.id],
    queryFn: async () => {
      if (!user?.id) return [];
      const { data, error } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const form = useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
      phone: "",
      useSameForBilling: true,
    },
  });

  // Set form values when addresses are loaded
  React.useEffect(() => {
    if (addresses && addresses.length > 0) {
      const lastAddress = addresses[0];
      form.reset({
        ...form.getValues(),
        address1: lastAddress.street_address1,
        address2: lastAddress.street_address2 || "",
        city: lastAddress.city,
        state: lastAddress.state,
        zipCode: lastAddress.zip_code,
      });
      setIsAddressSaved(true);
    }
  }, [addresses]);

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

      // First, check if the user already has an address
      const { data: existingAddresses } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .single();

      if (existingAddresses) {
        // Update existing address
        const { error: updateError } = await supabase
          .from("addresses")
          .update({
            street_address1: values.address1,
            street_address2: values.address2,
            city: values.city,
            state: values.state,
            zip_code: values.zipCode,
            type: 'shipping',
          })
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new address
        const { error: insertError } = await supabase
          .from("addresses")
          .insert({
            user_id: user.id,
            street_address1: values.address1,
            street_address2: values.address2,
            city: values.city,
            state: values.state,
            zip_code: values.zipCode,
            type: 'shipping',
          });

        if (insertError) throw insertError;
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

  const onSubmit = async (values: ShippingFormData) => {
    await saveAddress(values);
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
        
        {user && addresses?.length > 1 && (
          <div className="mb-4">
            <Button
              variant="outline"
              onClick={() => setShowAddressSelect(!showAddressSelect)}
              className="w-full mb-4"
            >
              {showAddressSelect ? "Hide Saved Addresses" : "Select Another Address"}
            </Button>
            
            {showAddressSelect && (
              <SavedAddressSelect
                userId={user.id}
                selectedAddressId={selectedAddressId}
                onAddressSelect={(addressId) => {
                  const selectedAddress = addresses.find(addr => addr.id === addressId);
                  if (selectedAddress) {
                    form.reset({
                      ...form.getValues(),
                      address1: selectedAddress.street_address1,
                      address2: selectedAddress.street_address2 || "",
                      city: selectedAddress.city,
                      state: selectedAddress.state,
                      zipCode: selectedAddress.zip_code,
                    });
                    setSelectedAddressId(addressId);
                  }
                }}
                onAddNew={() => setSelectedAddressId(null)}
              />
            )}
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <PersonalInfoFields form={form} />
            <AddressFields form={form} />
            <ContactFields form={form} />

            <div className="flex items-center space-x-2">
              <Checkbox
                id="useSameForBilling"
                checked={form.watch("useSameForBilling")}
                onCheckedChange={(checked) => {
                  form.setValue("useSameForBilling", checked as boolean);
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
              isAddressSaved={isAddressSaved}
              onCancel={handleCancel}
              onContinue={handleContinue}
            />
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Shipping;