
import { Skeleton } from "@/components/ui/skeleton";
import { UserAvatar } from "./UserAvatar";

interface UserInfoProps {
  isLoading: boolean;
  userName: string;
  userEmail: string;
  userAvatar?: string;
}

export const UserInfo = ({ isLoading, userName, userEmail, userAvatar }: UserInfoProps) => {
  if (isLoading) {
    return (
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-32" />
        </div>
      </div>
    );
  }

  const displayName = userName && userName.trim() ? userName : userEmail ? userEmail.split('@')[0] : 'User';

  return (
    <>
      <UserAvatar userAvatar={userAvatar} userName={displayName} />
      <div className="flex flex-col">
        <span className="text-sm font-medium text-black">{displayName}</span>
        <span className="text-xs text-gray-600">{userEmail || ''}</span>
      </div>
    </>
  );
};
