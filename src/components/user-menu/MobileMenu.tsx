
import { User, ShoppingBag, LogOut, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { UserInfo } from "./UserInfo";
import { useState } from "react";

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
  const [isOpen, setIsOpen] = useState(false);

  const handleAdminClick = () => {
    handleAdminNavigation();
    setIsOpen(false);
  };

  const handleLogoutClick = () => {
    handleLogout();
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <User className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[280px] p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b border-gray-200">
            <UserInfo
              isLoading={isLoading}
              userName={userName}
              userEmail={userEmail}
              userAvatar={userAvatar}
            />
          </div>

          <nav className="flex-1 p-4 space-y-1">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
              asChild
            >
              <Link to="/profile">
                <User className="h-4 w-4" />
                <span className="ml-2">My Profile</span>
              </Link>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setIsOpen(false)}
              asChild
            >
              <Link to="/sample-orders">
                <ShoppingBag className="h-4 w-4" />
                <span className="ml-2">Orders</span>
              </Link>
            </Button>

            {isAdmin && (
              <Button
                variant="ghost"
                className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50"
                onClick={handleAdminClick}
              >
                <Settings className="h-4 w-4" />
                <span className="ml-2">{isInAdminPanel ? "View as User" : "View as Admin"}</span>
              </Button>
            )}

            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleLogoutClick}
            >
              <LogOut className="h-4 w-4" />
              <span className="ml-2">Logout</span>
            </Button>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  );
};
