import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const UserAvatar = ({ userAvatar, userName }: UserAvatarProps) => {
  return (
    <Avatar className="h-10 w-10 border border-gray-200">
      <AvatarImage src={userAvatar} alt={userName} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {userName ? userName.charAt(0) : "?"}
      </AvatarFallback>
    </Avatar>
  );
};