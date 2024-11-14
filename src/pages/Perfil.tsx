import { ProfileForm } from "@/components/profile/ProfileForm";
import { PasswordChangeForm } from "@/components/profile/PasswordChangeForm";
import { Separator } from "@/components/ui/separator";

const Perfil = () => {
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