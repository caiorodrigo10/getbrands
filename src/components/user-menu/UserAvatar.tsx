
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const UserAvatar = ({ userAvatar, userName }: UserAvatarProps) => {
  // Get the first letter of the name, or fallback to a placeholder
  const getInitial = () => {
    if (userName && userName.trim().length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <Avatar className="h-10 w-10 border border-gray-200">
      {userAvatar ? (
        <AvatarImage 
          src={userAvatar} 
          alt={userName || 'User'} 
          onError={(e) => {
            // Handle image loading errors
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
          }}
        />
      ) : null}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitial()}
      </AvatarFallback>
    </Avatar>
  );
};
