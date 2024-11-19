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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, ShoppingBag, LayoutDashboard } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

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
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;
    
    setIsLoading(true);
    const { data } = await supabase
      .from("profiles")
      .select()
      .eq("id", user.id)
      .single();
      
    if (data) {
      setProfile(data);
    }
    setIsLoading(false);
  };

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

  const renderUserInfo = () => {
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

    return (
      <>
        <Avatar className="h-10 w-10 border border-gray-200">
          <AvatarImage src={userAvatar} alt={userName} />
          <AvatarFallback className="bg-primary text-primary-foreground">
            {userName ? userName.charAt(0) : "?"}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-black">{userName}</span>
          <span className="text-xs text-gray-600">{userEmail}</span>
        </div>
      </>
    );
  };

  if (isMobile) {
    return (
      <div className="flex flex-col">
        <div className="flex items-center gap-3 mb-4">
          {renderUserInfo()}
        </div>
        <div className="flex flex-col space-y-1">
          <Link 
            to="/profile" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#fff4fc] hover:text-black rounded-md"
          >
            <User className="h-4 w-4" />
            <span>My Profile</span>
          </Link>
          <Link 
            to="/sample-orders" 
            className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#fff4fc] hover:text-black rounded-md"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>Orders</span>
          </Link>
          {isAdmin && (
            <button
              onClick={handleAdminNavigation}
              className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#fff4fc] hover:text-black rounded-md w-full text-left"
            >
              <LayoutDashboard className="h-4 w-4" />
              <span>{isInAdminPanel ? 'User View' : 'Admin Panel'}</span>
            </button>
          )}
          <button
            onClick={logout}
            className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-[#fff4fc] hover:text-red-500 rounded-md w-full text-left"
          >
            <LogOut className="h-4 w-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>
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
            {renderUserInfo()}
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        className="w-64 bg-white rounded-lg shadow-lg border border-gray-200" 
        align="end"
      >
        <DropdownMenuLabel className="p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 border">
              <AvatarImage src={userAvatar} alt={userName} />
              <AvatarFallback className="bg-primary text-primary-foreground">
                {userName ? userName.charAt(0) : "?"}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <p className="text-sm font-medium text-black">{userName}</p>
              <p className="text-xs text-gray-600">{userEmail}</p>
            </div>
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
            onClick={logout}
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
