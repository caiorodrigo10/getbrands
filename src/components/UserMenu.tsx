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
import { useProfileManagement } from "@/hooks/useProfileManagement";
import { errorMessages } from "@/utils/errorMessages";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

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

  const getErrorMessage = (key: string) => {
    return errorMessages[key][isPortuguese ? 'pt' : 'en'];
  };

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  if (!user) return null;

  const userEmail = user.email || "";
  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";
  const userAvatar = profile?.avatar_url;
  const isAdmin = profile?.role === "admin";

  const handleAdminNavigation = () => {
    if (isInAdminPanel) {
      navigate('/dashboard');
    } else {
      navigate('/admin');
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