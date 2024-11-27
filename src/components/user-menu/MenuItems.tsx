import { Link } from "react-router-dom";
import { User, ShoppingBag, LayoutDashboard, LogOut } from "lucide-react";
import { DropdownMenuItem } from "@/components/ui/dropdown-menu";

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
  handleLogout
}: MenuItemsProps) => {
  return (
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
  );
};