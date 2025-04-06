
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";

interface UserAvatarProps {
  userAvatar?: string;
  userName: string;
}

export const UserAvatar = ({ userAvatar, userName }: UserAvatarProps) => {
  const [imageError, setImageError] = useState(false);
  
  // Get the first letter of the name, or fallback to a placeholder
  const getInitial = () => {
    if (userName && userName.trim().length > 0) {
      return userName.charAt(0).toUpperCase();
    }
    return "U";
  };

  return (
    <Avatar className="h-10 w-10 border border-gray-200">
      {userAvatar && !imageError ? (
        <AvatarImage 
          src={userAvatar} 
          alt={userName || 'User'} 
          onError={() => setImageError(true)}
        />
      ) : null}
      <AvatarFallback className="bg-primary text-primary-foreground">
        {getInitial()}
      </AvatarFallback>
    </Avatar>
  );
};
