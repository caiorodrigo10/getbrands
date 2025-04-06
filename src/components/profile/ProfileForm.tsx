
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ProfileFormData, profileFormSchema } from "./types";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { AddressFields } from "./AddressFields";
import { Button } from "@/components/ui/button";
import { useEffect } from "react";

export const ProfileForm = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log("ProfileForm - Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile in ProfileForm:", error);
        throw error;
      }
      
      console.log("ProfileForm - Profile data retrieved:", data);
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  const form = useForm<ProfileFormData>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      email: "",
      phone: "",
      shipping_address_street: "",
      shipping_address_street2: "",
      shipping_address_city: "",
      shipping_address_state: "",
      shipping_address_zip: "",
    },
  });

  // Update form values when profile data is loaded
  useEffect(() => {
    if (profile && !isLoading) {
      console.log("ProfileForm - Setting form values with profile data:", profile);
      
      form.reset({
        first_name: profile.first_name || "",
        last_name: profile.last_name || "",
        email: profile.email || user?.email || "",
        phone: profile.phone || "",
        shipping_address_street: profile.shipping_address_street || "",
        shipping_address_street2: profile.shipping_address_street2 || "",
        shipping_address_city: profile.shipping_address_city || "",
        shipping_address_state: profile.shipping_address_state || "",
        shipping_address_zip: profile.shipping_address_zip || "",
      });
    }
  }, [profile, isLoading, form, user]);

  const onSubmit = async (data: ProfileFormData) => {
    try {
      console.log("ProfileForm - Submitting form data:", data);
      
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
      
      // Invalidate queries to refresh data throughout the app
      queryClient.invalidateQueries({ queryKey: ["profile", user?.id] });
      
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

  if (isLoading) {
    return <div className="flex justify-center py-8">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>;
  }

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
