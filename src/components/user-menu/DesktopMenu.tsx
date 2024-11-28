import { Link } from "react-router-dom";
import { User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { UserInfo } from "./UserInfo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface DesktopMenuProps {
  isAdmin: boolean;
  isInAdminPanel: boolean;
  handleAdminNavigation: () => void;
  handleLogout: () => void;
}

export const DesktopMenu = ({
  isAdmin,
  isInAdminPanel,
  handleAdminNavigation,
  handleLogout,
}: DesktopMenuProps) => {
  const { user, isLoading } = useAuth();
  
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
              userName={user?.user_metadata?.name || 'User'}
              userEmail={user?.email || ''}
              userAvatar={user?.user_metadata?.avatar_url}
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
              userName={user?.user_metadata?.name || 'User'}
              userEmail={user?.email || ''}
              userAvatar={user?.user_metadata?.avatar_url}
            />
          </div>
        </DropdownMenuLabel>
        
        <div className="p-2 space-y-1">
          <Link to="/profile">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <User className="h-4 w-4" />
              <span className="ml-2">My Profile</span>
            </Button>
          </Link>

          <Link to="/sample-orders">
            <Button
              variant="ghost"
              className="w-full justify-start"
            >
              <ShoppingBag className="h-4 w-4" />
              <span className="ml-2">Orders</span>
            </Button>
          </Link>

          {isAdmin && (
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={handleAdminNavigation}
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2">{isInAdminPanel ? "View as User" : "View as Admin"}</span>
            </Button>
          )}

          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="ml-2">Logout</span>
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};