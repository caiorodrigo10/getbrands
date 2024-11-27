import { Link } from "react-router-dom";
import { User, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
import { UserInfo } from "./UserInfo";

interface MobileMenuProps {
  userName: string;
  userEmail: string;
  userAvatar?: string;
  isLoading: boolean;
  isAdmin: boolean;
  isInAdminPanel: boolean;
  handleAdminNavigation: () => void;
  handleLogout: () => void;
}

export const MobileMenu = ({
  userName,
  userEmail,
  userAvatar,
  isLoading,
  isAdmin,
  isInAdminPanel,
  handleAdminNavigation,
  handleLogout,
}: MobileMenuProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-center gap-3 mb-4">
        <UserInfo
          isLoading={isLoading}
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
        />
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
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-[#fff4fc] hover:text-red-500 rounded-md w-full text-left"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </div>
  );
};