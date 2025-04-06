
import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { useEffect } from "react";

const Profile = () => {
  const { user } = useAuth();
  const { profile, isLoading } = useAuthWithPermissions();

  useEffect(() => {
    console.log("Profile page - Current profile data:", {
      profile,
      user: user?.user_metadata,
      isLoading
    });
  }, [profile, isLoading, user]);

  // Safe extraction of avatar URL with proper fallbacks
  const avatarUrl = profile?.avatar_url || user?.user_metadata?.avatar_url || null;

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
            avatarUrl={avatarUrl} 
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
