import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { SavedAddressSelect } from "@/components/shipping/SavedAddressSelect";
import { Checkbox } from "@/components/ui/checkbox";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
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
  billingAddress1: z.string().min(5, "Billing address is too short").optional(),
  billingAddress2: z.string().optional(),
  billingCity: z.string().min(2, "Billing city is too short").optional(),
  billingState: z.string().min(2, "Invalid billing state").optional(),
  billingZipCode: z.string().min(5, "Invalid billing ZIP code").optional(),
});

const Shipping = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [showNewAddressForm, setShowNewAddressForm] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);

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
      billingAddress1: "",
      billingAddress2: "",
      billingCity: "",
      billingState: "",
      billingZipCode: "",
    },
  });

  const useSameForBilling = form.watch("useSameForBilling");

  const saveAddress = async (values: ShippingFormData) => {
    try {
      if (!user?.id) throw new Error("User not authenticated");

      const { error: shippingError } = await supabase.from("addresses").insert({
        user_id: user.id,
        name: `${values.firstName} ${values.lastName}`,
        street_address1: values.address1,
        street_address2: values.address2,
        city: values.city,
        state: values.state,
        zip_code: values.zipCode,
        type: values.useSameForBilling ? 'both' : 'shipping',
      });

      if (shippingError) throw shippingError;

      if (!values.useSameForBilling) {
        const { error: billingError } = await supabase.from("addresses").insert({
          user_id: user.id,
          name: `${values.firstName} ${values.lastName} (Billing)`,
          street_address1: values.billingAddress1!,
          street_address2: values.billingAddress2,
          city: values.billingCity!,
          state: values.billingState!,
          zip_code: values.billingZipCode!,
          type: 'billing',
        });

        if (billingError) throw billingError;
      }

      toast({
        title: "Success",
        description: "Address saved successfully",
      });
      
      setShowNewAddressForm(false);
      // Refresh the addresses list
      const { data } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .in('type', ['shipping', 'both'])
        .order('created_at', { ascending: false })
        .single();
      
      if (data) {
        setSelectedAddressId(data.id);
      }
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
    if (showNewAddressForm) {
      await saveAddress(values);
      return;
    }

    if (!selectedAddressId) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select or save an address to continue.",
      });
      return;
    }

    // Store shipping info in session storage for the next step
    sessionStorage.setItem("shippingInfo", JSON.stringify({
      ...values,
      addressId: selectedAddressId,
    }));

    navigate("/checkout/payment");
  };

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
        
        {user && (
          <div className="mb-8">
            <h3 className="text-lg font-medium mb-4">Select Shipping Address</h3>
            <SavedAddressSelect
              userId={user.id}
              selectedAddressId={selectedAddressId}
              onAddressSelect={(id) => {
                setSelectedAddressId(id);
                setShowNewAddressForm(false);
              }}
              onAddNew={() => {
                setSelectedAddressId(null);
                setShowNewAddressForm(true);
              }}
            />
          </div>
        )}

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showNewAddressForm && (
              <>
                <PersonalInfoFields form={form} />
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-4">Shipping Address</h3>
                    <AddressFields form={form} />
                  </div>
                  <ContactFields form={form} />
                </div>

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

                {!useSameForBilling && (
                  <div className="space-y-6 pt-4">
                    <h3 className="text-lg font-medium">Billing Address</h3>
                    <AddressFields 
                      form={form} 
                      prefix="billing"
                      formFields={{
                        address1: "billingAddress1",
                        address2: "billingAddress2",
                        city: "billingCity",
                        state: "billingState",
                        zipCode: "billingZipCode",
                      }}
                    />
                  </div>
                )}
              </>
            )}

            <div className="flex flex-col gap-4 pt-6">
              {showNewAddressForm && (
                <Button 
                  type="submit"
                  className="w-full"
                >
                  Save Address
                </Button>
              )}
              <Button 
                type="button"
                onClick={() => form.handleSubmit(onSubmit)()}
                className={`w-full ${selectedAddressId ? 'bg-purple-600 hover:bg-purple-700' : 'bg-gray-400'}`}
                disabled={!selectedAddressId && !showNewAddressForm}
              >
                Continue to Payment
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default Shipping;