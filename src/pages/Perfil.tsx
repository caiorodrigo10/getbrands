import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const addressSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  address1: z.string().min(1, "Address is required"),
  address2: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
});

type AddressFormData = z.infer<typeof addressSchema>;

const Perfil = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const loadAddress = async () => {
      if (!user) return;

      try {
        const { data: address, error } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (address) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("name, email")
            .eq("id", user.id)
            .single();

          const [firstName, lastName] = (profile?.name || "").split(" ");

          form.reset({
            firstName: firstName || "",
            lastName: lastName || "",
            address1: address.street_address1,
            address2: address.street_address2 || "",
            city: address.city,
            state: address.state,
            zipCode: address.zip_code,
          });
        }
      } catch (error) {
        console.error("Error loading address:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAddress();
  }, [user, form]);

  const onSubmit = async (data: AddressFormData) => {
    if (!user) return;

    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({ name: `${data.firstName} ${data.lastName}` })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const addressData = {
        user_id: user.id,
        street_address1: data.address1,
        street_address2: data.address2,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
      };

      const { error: addressError } = await supabase
        .from("addresses")
        .upsert(addressData, { onConflict: "user_id" });

      if (addressError) throw addressError;

      toast({
        title: "Success",
        description: "Your profile has been updated successfully.",
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

  if (!user) return null;

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <CardTitle>My Profile</CardTitle>
          <CardDescription>Update your U.S. shipping address.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoFields form={form} />
              <AddressFields form={form} />
              <Button type="submit" className="w-full">
                Save Changes
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;