import { Link } from "react-router-dom";
import { User, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
import { useLocation } from "react-router-dom";

interface UserMenuContentProps {
  userName: string;
  userEmail: string;
  isAdmin: boolean;
  isInAdminPanel: boolean;
  handleAdminNavigation: () => void;
  handleLogout: () => void;
  isMobile: boolean;
}

export const UserMenuContent = ({
  userName,
  userEmail,
  isAdmin,
  isInAdminPanel,
  handleAdminNavigation,
  handleLogout,
  isMobile
}: UserMenuContentProps) => {
  if (isMobile) {
    return (
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
    );
  }

  return (
    <div className="p-1">
      <Link to="/profile">
        <div className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-black rounded-md">
          <User className="h-4 w-4 text-black" />
          <span className="text-black">My Profile</span>
        </div>
      </Link>
      <Link to="/sample-orders">
        <div className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-black rounded-md">
          <ShoppingBag className="h-4 w-4 text-black" />
          <span className="text-black">Orders</span>
        </div>
      </Link>
      {isAdmin && (
        <div 
          onClick={handleAdminNavigation}
          className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-black rounded-md"
        >
          <LayoutDashboard className="h-4 w-4 text-black" />
          <span className="text-black">{isInAdminPanel ? 'User View' : 'Admin Panel'}</span>
        </div>
      )}
      <div 
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm cursor-pointer hover:bg-[#fff4fc] hover:text-red-600 rounded-md text-red-600"
      >
        <LogOut className="h-4 w-4" />
        <span>Sign Out</span>
      </div>
    </div>
  );
};