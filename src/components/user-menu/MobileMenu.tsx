import { Link, useNavigate } from "react-router-dom";
import { User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { UserInfo } from "./UserInfo";
import { Button } from "@/components/ui/button";

interface MobileMenuProps {
  isAdmin: boolean;
  isInAdminPanel: boolean;
  handleAdminNavigation: () => void;
  handleLogout: () => void;
  handleClose: () => void;
}

export const MobileMenu = ({
  isAdmin,
  isInAdminPanel,
  handleAdminNavigation,
  handleLogout,
  handleClose,
}: MobileMenuProps) => {
  const navigate = useNavigate();

  const handleNavigation = (path: string) => {
    navigate(path);
    handleClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-white p-6">
      <div className="mb-8">
        <UserInfo />
      </div>

      <div className="space-y-4">
        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleNavigation('/profile')}
        >
          <User className="h-4 w-4" />
          <span className="ml-2">My Profile</span>
        </Button>

        <Button
          variant="ghost"
          className="w-full justify-start"
          onClick={() => handleNavigation('/sample-orders')}
        >
          <ShoppingBag className="h-4 w-4" />
          <span className="ml-2">Orders</span>
        </Button>

        {isAdmin && (
          <Button
            variant="ghost"
            className="w-full justify-start text-purple-600 hover:text-purple-700"
            onClick={handleAdminNavigation}
          >
            <Settings className="h-4 w-4" />
            <span className="ml-2">{isInAdminPanel ? "View as User" : "View as Admin"}</span>
          </Button>
        )}

        <Button
          variant="ghost"
          className="w-full justify-start text-red-500 hover:text-red-600"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4" />
          <span className="ml-2">Logout</span>
        </Button>
      </div>
    </div>
  );
};