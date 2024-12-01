import { useEffect, useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { UserInfo } from "./user-menu/UserInfo";
import { MobileMenu } from "./user-menu/MobileMenu";
import { MenuItems } from "./user-menu/MenuItems";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { toast } from "sonner";

interface UserMenuProps {
  isMobile: boolean;
}

const UserMenu = ({ isMobile }: UserMenuProps) => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const { handleLogout } = useSessionManagement();
  const [isInAdminPanel, setIsInAdminPanel] = useState(location.pathname.startsWith('/admin'));

  useEffect(() => {
    let isMounted = true;

    const fetchProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          toast.error("Session error. Please try logging in again.");
          navigate('/');
          return;
        }

        if (!session) {
          navigate('/');
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id);
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error("Failed to load profile data. Please refresh the page.");
          return;
        }

        if (data && data.length > 0 && isMounted) {
          setProfile(data[0]);
        } else {
          // Se o perfil não existir, vamos criar/atualizar
          const { data: upsertedProfile, error: upsertError } = await supabase
            .from("profiles")
            .upsert({ 
              id: user.id, 
              email: user.email,
              updated_at: new Date().toISOString()
            })
            .select()
            .single();

          if (upsertError) {
            console.error('Error upserting profile:', upsertError);
            toast.error("Failed to create/update profile. Please try again.");
            return;
          }

          if (upsertedProfile && isMounted) {
            setProfile(upsertedProfile);
          }
        }
      } catch (error) {
        console.error('Error in profile fetch:', error);
        toast.error("Network error. Please check your connection.");
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchProfile();

    return () => {
      isMounted = false;
    };
  }, [user, navigate]);

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