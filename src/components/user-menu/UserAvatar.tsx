
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const UserAvatar = ({ userAvatar, userName }: UserAvatarProps) => {
  // Get the first letter of the name, or fallback to email initial if available
  const getInitial = () => {
    if (userName && userName.trim().length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return "?";
  };

  return (
    <Avatar className="h-10 w-10 border border-gray-200">
      <AvatarImage src={userAvatar || ''} alt={userName || 'User'} />
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitial()}
      </AvatarFallback>
    </Avatar>
  );
};
