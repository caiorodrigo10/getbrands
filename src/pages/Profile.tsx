import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { AvatarUpload } from "@/components/profile/AvatarUpload";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const Perfil = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

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

export default Perfil;