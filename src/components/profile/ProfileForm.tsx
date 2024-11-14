import { Form } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "@/types/shipping";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

interface ProfileFormProps {
  form: UseFormReturn<ShippingFormData>;
  onSubmit: (data: ShippingFormData) => Promise<void>;
  isSaving: boolean;
}

export const ProfileForm = ({ form, onSubmit, isSaving }: ProfileFormProps) => {
  const { toast } = useToast();
  const { user } = useAuth();

  const handleSubmit = async (data: ShippingFormData) => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to update your profile.",
      });
      return;
    }

    try {
      // Update profile information
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      // Check if address exists
      const { data: existingAddress, error: addressQueryError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle();

      if (addressQueryError && addressQueryError.code !== "PGRST116") throw addressQueryError;

      const addressData = {
        user_id: user.id,
        street_address1: data.address1,
        street_address2: data.address2 || null,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
      };

      if (existingAddress) {
        // Update existing address
        const { error: addressError } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("user_id", user.id);

        if (addressError) throw addressError;
      } else {
        // Insert new address
        const { error: addressError } = await supabase
          .from("addresses")
          .insert([addressData]);

        if (addressError) throw addressError;
      }

      await onSubmit(data);
      
      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile. Please try again.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <PersonalInfoFields form={form} />
        <ContactFields form={form} />
        <AddressFields form={form} />
        <Button type="submit" disabled={isSaving} className="w-full">
          {isSaving ? "Saving..." : "Save Changes"}
        </Button>
      </form>
    </Form>
  );
};