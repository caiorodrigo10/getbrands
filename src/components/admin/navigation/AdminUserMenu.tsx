import { Link } from "react-router-dom";
import { User, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { UserAvatar } from "@/components/user-menu/UserAvatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface AdminUserMenuProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  isInAdminPanel: boolean;
  handleAdminNavigation: () => void;
  handleLogout: () => void;
}

export const AdminUserMenu = ({
  userName,
  userEmail,
  userAvatar,
  isInAdminPanel,
  handleAdminNavigation,
  handleLogout
}: AdminUserMenuProps) => {
  return (
    <div className="p-4 border-t border-gray-200">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="relative h-auto w-full flex flex-col items-start gap-1 px-3 py-2 hover:bg-[#fff4fc] hover:text-black"
          >
            <div className="flex items-center gap-3 w-full">
              <UserAvatar userAvatar={userAvatar} userName={userName} />
              <div className="flex flex-col items-start">
                <span className="text-sm font-medium text-black">{userName}</span>
                <span className="text-xs text-gray-600">{userEmail}</span>
              </div>
            </div>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent 
          className="w-64 bg-white rounded-lg shadow-lg border border-gray-200" 
          align="end"
        >
          <DropdownMenuLabel className="p-4">
            <div className="flex items-center gap-3">
              <UserAvatar userAvatar={userAvatar} userName={userName} />
              <div className="flex flex-col">
                <span className="text-sm font-medium text-black">{userName}</span>
                <span className="text-xs text-gray-600">{userEmail}</span>
              </div>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-gray-100" />
          <div className="p-2 space-y-1">
            <Link to="/profile">
              <Button
                variant="ghost"
                className="w-full justify-start"
              >
                <User className="h-4 w-4" />
                <span className="ml-2">Meu Perfil</span>
              </Button>
            </Link>
            <Button
              variant="ghost"
              className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
              onClick={handleAdminNavigation}
            >
              <Settings className="h-4 w-4" />
              <span className="ml-2">{isInAdminPanel ? "View as User" : "View as Admin"}</span>
            </Button>
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
    </div>
  );
};