import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { PersonalInfoFields } from "@/components/shipping/PersonalInfoFields";
import { AddressFields } from "@/components/shipping/AddressFields";
import { ContactFields } from "@/components/shipping/ContactFields";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { addressSchema, type AddressFormData } from "@/types/shipping";

const Perfil = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<AddressFormData>({
    resolver: zodResolver(addressSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address1: "",
      address2: "",
      city: "",
      state: "",
      zipCode: "",
    },
  });

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;

      try {
        const { data: profile, error: profileError } = await supabase
          .from("profiles")
          .select("name, email, phone, avatar_url")
          .eq("id", user.id)
          .single();

        if (profileError) throw profileError;

        const { data: addresses, error: addressError } = await supabase
          .from("addresses")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (addressError) throw addressError;

        const [firstName, lastName] = (profile?.name || "").split(" ");
        setAvatarUrl(profile?.avatar_url);

        form.reset({
          firstName: firstName || "",
          lastName: lastName || "",
          email: profile?.email || "",
          phone: profile?.phone || "",
          address1: addresses?.street_address1 || "",
          address2: addresses?.street_address2 || "",
          city: addresses?.city || "",
          state: addresses?.state || "",
          zipCode: addresses?.zip_code || "",
        });
      } catch (error) {
        console.error("Error loading profile:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load profile information. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadProfile();
  }, [user, form, toast]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    try {
      const fileExt = file.name.split('.').pop();
      const filePath = `${user.id}/${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('profile-pictures')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('profile-pictures')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast({
        title: "Success",
        description: "Profile picture updated successfully.",
      });
    } catch (error) {
      console.error("Error uploading avatar:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to upload profile picture. Please try again.",
      });
    }
  };

  const onSubmit = async (data: AddressFormData) => {
    if (!user) return;
    setIsSaving(true);

    try {
      // Update profile
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          name: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
        })
        .eq("id", user.id);

      if (profileError) throw profileError;

      const addressData = {
        user_id: user.id,
        street_address1: data.address1,
        street_address2: data.address2 || null,
        city: data.city,
        state: data.state,
        zip_code: data.zipCode,
      };

      // Check if address exists
      const { data: existingAddress } = await supabase
        .from("addresses")
        .select("id")
        .eq("user_id", user.id)
        .maybeSingle();

      let addressError;
      if (existingAddress) {
        // Update existing address
        const { error } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("user_id", user.id);
        addressError = error;
      } else {
        // Insert new address
        const { error } = await supabase
          .from("addresses")
          .insert([addressData]);
        addressError = error;
      }

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
    } finally {
      setIsSaving(false);
    }
  };

  if (!user) return null;

  return (
    <div className="container max-w-2xl py-10">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <label htmlFor="avatar-upload" className="cursor-pointer">
              <Avatar className="h-20 w-20">
                <AvatarImage src={avatarUrl || undefined} />
                <AvatarFallback>{user.email?.[0].toUpperCase()}</AvatarFallback>
              </Avatar>
              <input
                id="avatar-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />
            </label>
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your profile information and shipping address.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <PersonalInfoFields form={form} />
              <ContactFields form={form} />
              <AddressFields form={form} />
              <Button type="submit" disabled={isSaving} className="w-full">
                {isSaving ? "Saving..." : "Save Changes"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Perfil;