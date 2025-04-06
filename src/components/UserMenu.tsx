
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { UserInfo } from "./user-menu/UserInfo";
import { MobileMenu } from "./user-menu/MobileMenu";
import { MenuItems } from "./user-menu/MenuItems";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { errorMessages } from "@/utils/errorMessages";
import { toast } from "sonner";

interface UserMenuProps {
  isMobile: boolean;
}

const UserMenu = ({ isMobile }: UserMenuProps) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useSessionManagement();
  const [isInAdminPanel, setIsInAdminPanel] = useState(location.pathname.startsWith('/admin'));
  const isPortuguese = location.pathname.startsWith('/pt');
  const { profile, isAdmin, isLoading } = useAuthWithPermissions();

  const getErrorMessage = (key: string) => {
    return errorMessages[key][isPortuguese ? 'pt' : 'en'];
  };

  if (!user) return null;

  const userEmail = user.email || "";
  const firstName = profile?.first_name || user?.user_metadata?.first_name || "";
  const lastName = profile?.last_name || user?.user_metadata?.last_name || "";
  const userName = firstName || lastName 
    ? `${firstName} ${lastName}`.trim() 
    : userEmail.split('@')[0];
  
  const userAvatar = profile?.avatar_url || user?.user_metadata?.avatar_url;

  const handleAdminNavigation = () => {
    if (isInAdminPanel) {
      navigate('/dashboard');
      toast.success(isPortuguese ? "Voltou para visão de usuário" : "Switched to user view");
    } else {
      navigate('/admin');
      toast.success(isPortuguese ? "Alterado para visão de admin" : "Switched to admin view");
    }
    setIsInAdminPanel(!isInAdminPanel);
  };

  if (isMobile) {
    return (
      <MobileMenu
        userName={userName}
        userEmail={userEmail}
        userAvatar={userAvatar}
        isLoading={isLoading}
        isAdmin={isAdmin}
        isInAdminPanel={isInAdminPanel}
        handleAdminNavigation={handleAdminNavigation}
        handleLogout={handleLogout}
      />
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          className="relative h-auto w-full flex flex-col items-start gap-1 px-3 py-2 hover:bg-[#fff4fc] hover:text-black"
        >
          <div className="flex items-center gap-3 w-full">
            <UserInfo
              isLoading={isLoading}
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
            />
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white rounded-lg shadow-lg border border-gray-200" 
        align="end"
      >
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <UserInfo
              isLoading={isLoading}
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
            />
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-100" />
        <MenuItems
          isAdmin={isAdmin}
          isInAdminPanel={isInAdminPanel}
          handleAdminNavigation={handleAdminNavigation}
          handleLogout={handleLogout}
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;
