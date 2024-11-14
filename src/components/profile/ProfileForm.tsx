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
      address_street: profile?.address_street || "",
      address_street2: profile?.address_street2 || "",
      address_city: profile?.address_city || "",
      address_state: profile?.address_state || "",
      address_zip: profile?.address_zip || "",
    },
    values: {
      first_name: profile?.first_name || "",
      last_name: profile?.last_name || "",
      email: profile?.email || "",
      phone: profile?.phone || "",
      address_street: profile?.address_street || "",
      address_street2: profile?.address_street2 || "",
      address_city: profile?.address_city || "",
      address_state: profile?.address_state || "",
      address_zip: profile?.address_zip || "",
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
          address_street: data.address_street,
          address_street2: data.address_street2,
          address_city: data.address_city,
          address_state: data.address_state,
          address_zip: data.address_zip,
        })
        .eq("id", user?.id);

      if (error) throw error;

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