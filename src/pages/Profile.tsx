
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log("Profile page - Fetching profile for user:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error("Error fetching profile in Profile page:", error);
        // Return basic profile with user email if we can't fetch from database
        if (user) {
          return {
            id: user.id,
            email: user.email,
          };
        }
        throw error;
      }
      
      console.log("Profile page - Profile data:", data);
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
  });

  useEffect(() => {
    console.log("Profile page - Current profile data:", {
      profile,
      user: user?.user_metadata,
      isLoading
    });
  }, [profile, isLoading, user]);

  return (
    <div className="container max-w-2xl mx-auto space-y-8 p-4">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Profile Settings</h2>
        <p className="text-muted-foreground">
          Manage your profile information and password
        </p>
      </div>
      
      <div className="space-y-8">
        <div>
          <h3 className="text-lg font-medium">Profile Picture</h3>
          <p className="text-sm text-muted-foreground">
            Update your profile picture
          </p>
          <Separator className="my-4" />
          <AvatarUpload 
            user={user} 
            avatarUrl={profile?.avatar_url} 
            setAvatarUrl={(url) => {}} 
          />
        </div>

        <div>
          <h3 className="text-lg font-medium">Profile Information</h3>
          <p className="text-sm text-muted-foreground">
            Update your personal information and address
          </p>
          <Separator className="my-4" />
          <ProfileForm />
        </div>

        <div>
          <h3 className="text-lg font-medium">Password</h3>
          <p className="text-sm text-muted-foreground">
            Change your password
          </p>
          <Separator className="my-4" />
          <PasswordChangeForm />
        </div>
      </div>
    </div>
  );
};

export default Profile;
