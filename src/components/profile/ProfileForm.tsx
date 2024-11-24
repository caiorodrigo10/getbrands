import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { ProfileFormData, profileFormSchema } from "./types";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { Button } from "@/components/ui/button";

export const ProfileForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      shipping_address_street: profile?.shipping_address_street || "",
      shipping_address_street2: profile?.shipping_address_street2 || "",
      shipping_address_city: profile?.shipping_address_city || "",
      shipping_address_state: profile?.shipping_address_state || "",
      shipping_address_zip: profile?.shipping_address_zip || "",
    },
    values: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      shipping_address_street: profile?.shipping_address_street || "",
      shipping_address_street2: profile?.shipping_address_street2 || "",
      shipping_address_city: profile?.shipping_address_city || "",
      shipping_address_state: profile?.shipping_address_state || "",
      shipping_address_zip: profile?.shipping_address_zip || "",
    },
  });

  const onSubmit = async (data: ProfileFormData) => {
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          phone: data.phone,
          shipping_address_street: data.shipping_address_street,
          shipping_address_street2: data.shipping_address_street2,
          shipping_address_city: data.shipping_address_city,
          shipping_address_state: data.shipping_address_state,
          shipping_address_zip: data.shipping_address_zip,
        })
        .eq("id", user?.id);

      if (error) throw error;
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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="space-y-8">
          <PersonalInfoFields form={form} />
          <AddressFields form={form} />
        </div>
        <Button type="submit">Save Changes</Button>
      </form>
    </Form>
  );
};

export default ProfileForm;