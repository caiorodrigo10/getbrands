import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { addressSchema, type ShippingFormData } from "@/types/shipping";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";

const Perfil = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);

  const form = useForm<ShippingFormData>({
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
    if (user) {
      loadProfile();
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setIsLoading(true);
      
      // Load profile data
      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      // Load address data
      const { data: address, error: addressError } = await supabase
        .from("addresses")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (addressError && addressError.code !== 'PGRST116') throw addressError;

      const [firstName, lastName] = (profile?.name || "").split(" ");
      
      form.reset({
        firstName: firstName || "",
        lastName: lastName || "",
        email: profile?.email || "",
        phone: profile?.phone || "",
        address1: address?.street_address1 || "",
        address2: address?.street_address2 || "",
        city: address?.city || "",
        state: address?.state || "",
        zipCode: address?.zip_code || "",
      });

      setAvatarUrl(profile?.avatar_url);
    } catch (error) {
      console.error("Error loading profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load profile information",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmit = async (data: ShippingFormData) => {
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

      // Prepare address data
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
        .single();

      if (existingAddress) {
        // Update existing address
        const { error: updateError } = await supabase
          .from("addresses")
          .update(addressData)
          .eq("user_id", user.id);

        if (updateError) throw updateError;
      } else {
        // Insert new address
        const { error: insertError } = await supabase
          .from("addresses")
          .insert([addressData]);

        if (insertError) throw insertError;
      }

      toast({
        title: "Success",
        description: "Profile updated successfully",
      });
      
      // Reload profile data
      await loadProfile();
    } catch (error) {
      console.error("Error updating profile:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update profile",
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
            <ProfileAvatar
              avatarUrl={avatarUrl}
              userEmail={user.email}
              onAvatarUpload={async (file) => {
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
                    description: "Profile picture updated successfully",
                  });
                } catch (error) {
                  console.error("Error uploading avatar:", error);
                  toast({
                    variant: "destructive",
                    title: "Error",
                    description: "Failed to upload profile picture",
                  });
                }
              }}
            />
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Update your profile information and shipping address.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {!isLoading && (
            <ProfileForm
              form={form}
              onSubmit={onSubmit}
              isSaving={isSaving}
            />
          )}
        </CardContent>
      </Card>
      
      <div className="mt-6">
        <PasswordChangeForm />
      </div>
    </div>
  );
};

export default Perfil;