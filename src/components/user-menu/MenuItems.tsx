
import { User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect } from "react";

interface MenuItemsProps {
  isAdmin: boolean;
  isInAdminPanel: boolean;
  handleAdminNavigation: () => void;
  handleLogout: () => void;
}

export const MenuItems = ({
  isAdmin,
  isInAdminPanel,
  handleAdminNavigation,
  handleLogout,
}: MenuItemsProps) => {
  useEffect(() => {
    console.log("MenuItems - Admin permissions:", { isAdmin, isInAdminPanel });
  }, [isAdmin, isInAdminPanel]);
  
  return (
    <div className="flex flex-col space-y-1">
      <Link
        to="/profile"
        className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#fff4fc] hover:text-black rounded-md"
      >
        <User className="h-4 w-4 text-black" />
        <span>My Profile</span>
      </Link>
      
      <Link
        to="/sample-orders"
        className="flex items-center gap-2 px-3 py-2 text-sm text-black hover:bg-[#fff4fc] hover:text-black rounded-md"
      >
        <ShoppingBag className="h-4 w-4 text-black" />
        <span>Orders</span>
      </Link>
      
      {isAdmin === true && (
        <button
          onClick={handleAdminNavigation}
          className="flex items-center gap-2 px-3 py-2 text-sm text-purple-600 hover:bg-[#fff4fc] hover:text-purple-700 rounded-md w-full text-left"
        >
          <Settings className="h-4 w-4" />
          <span>{isInAdminPanel ? "View as User" : "View as Admin"}</span>
        </button>
      )}
      
      <button
        onClick={handleLogout}
        className="flex items-center gap-2 px-3 py-2 text-sm text-red-500 hover:bg-[#fff4fc] hover:text-red-500 rounded-md w-full text-left"
      >
        <LogOut className="h-4 w-4" />
        <span>Logout</span>
      </button>
    </div>
  );
};
