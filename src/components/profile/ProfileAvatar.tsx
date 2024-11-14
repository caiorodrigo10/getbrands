import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfileAvatarProps {
  avatarUrl: string | null;
  userEmail: string | null;
  onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

export const ProfileAvatar = ({ avatarUrl, userEmail, onAvatarUpload }: ProfileAvatarProps) => {
  return (
    <label htmlFor="avatar-upload" className="cursor-pointer">
      <Avatar className="h-20 w-20">
        <AvatarImage src={avatarUrl || undefined} />
        <AvatarFallback>{userEmail?.[0].toUpperCase()}</AvatarFallback>
      </Avatar>
      <input
        id="avatar-upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onAvatarUpload}
      />
    </label>
  );
};