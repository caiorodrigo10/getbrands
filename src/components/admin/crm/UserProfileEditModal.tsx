import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileForm } from "./forms/ProfileForm";
import { PasswordForm } from "./forms/PasswordForm";

interface UserProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
    phone: string | null;
    avatar_url: string | null;
  };
  onUserUpdated: () => void;
}

export function UserProfileEditModal({ isOpen, onClose, user, onUserUpdated }: UserProfileEditModalProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
          <DialogDescription>
            Update user profile information and password
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="password">Password</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <ProfileForm 
              user={user}
              onClose={onClose}
              onUserUpdated={onUserUpdated}
            />
          </TabsContent>

          <TabsContent value="password">
            <PasswordForm onClose={onClose} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}