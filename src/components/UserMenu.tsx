import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { UserInfo } from "./user-menu/UserInfo";
import { MobileMenu } from "./user-menu/MobileMenu";
import { toast } from "sonner";

interface UserMenuProps {
  isMobile: boolean;
}

const UserMenu = ({ isMobile }: UserMenuProps) => {
  const { user, logout } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  const isInAdminPanel = location.pathname.startsWith('/admin');

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
          navigate('/login');
          return;
        }

        if (!session) {
          navigate('/login');
          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select()
          .eq("id", user.id)
          .single();
          
        if (error) {
          console.error('Error fetching profile:', error);
          toast.error("Failed to load profile data. Please refresh the page.");
          return;
        }

        if (data && isMounted) {
          setProfile(data);
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
  };

  const handleLogout = async () => {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
      if (sessionError) {
        console.error('Session error:', sessionError);
        navigate('/login');
        return;
      }

      if (!session) {
        navigate('/login');
        return;
      }

      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Error during logout. Please try again.");
      // Still navigate to login page even if there's an error
      navigate('/login');
    }
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
        <div className="p-1">
          <Link to="/profile">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-black rounded-md">
              <User className="h-4 w-4 text-black" />
              <span className="text-black">My Profile</span>
            </DropdownMenuItem>
          </Link>
          <Link to="/sample-orders">
            <DropdownMenuItem className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-black rounded-md">
              <ShoppingBag className="h-4 w-4 text-black" />
              <span className="text-black">Orders</span>
            </DropdownMenuItem>
          </Link>
          {isAdmin && (
            <DropdownMenuItem 
              onClick={handleAdminNavigation}
              className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-black rounded-md"
            >
              <LayoutDashboard className="h-4 w-4 text-black" />
              <span className="text-black">{isInAdminPanel ? 'User View' : 'Admin Panel'}</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={handleLogout}
            className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-red-600 rounded-md text-red-600"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserMenu;