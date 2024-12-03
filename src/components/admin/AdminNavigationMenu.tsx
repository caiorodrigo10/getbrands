import { Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/user-menu/UserAvatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  LayoutDashboard, 
  Package2, 
  Users, 
  ShoppingCart, 
  FolderKanban,
  Upload,
  Ticket,
  User,
  LogOut,
  Settings
} from "lucide-react";
import { useSessionManagement } from "@/hooks/useSessionManagement";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    href: "/admin",
    exact: true
  },
  {
    title: "Catalog",
    icon: Package2,
    href: "/admin/catalog"
  },
  {
    title: "CRM",
    icon: Users,
    href: "/admin/crm"
  },
  {
    title: "Orders",
    icon: ShoppingCart,
    href: "/admin/orders"
  },
  {
    title: "Projects",
    icon: FolderKanban,
    href: "/admin/projects"
  },
  {
    title: "Bulk Actions",
    icon: Upload,
    href: "/admin/bulk-actions"
  },
  {
    title: "Coupons",
    icon: Ticket,
    href: "/admin/coupons"
  }
];

export const AdminNavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleLogout } = useSessionManagement();
  const [isInAdminPanel, setIsInAdminPanel] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ["admin-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";
  const userEmail = user?.email || "";
  const userAvatar = profile?.avatar_url;

  const handleAdminNavigation = () => {
    if (isInAdminPanel) {
      navigate('/dashboard');
    } else {
      navigate('/admin');
    }
    setIsInAdminPanel(!isInAdminPanel);
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/admin">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = item.exact 
              ? location.pathname === item.href
              : location.pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors",
                  isActive
                    ? "bg-[#fff4fc] text-black"
                    : "text-gray-600 hover:bg-[#fff4fc] hover:text-black"
                )}
              >
                <item.icon className="mr-3 h-5 w-5" />
                {item.title}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button 
                variant="ghost" 
                className="w-full flex items-center gap-3 px-3 py-2 hover:bg-[#fff4fc] hover:text-black"
              >
                <UserAvatar userAvatar={userAvatar} userName={userName} />
                <div className="flex flex-col items-start">
                  <span className="text-sm font-medium text-black">{userName}</span>
                  <span className="text-xs text-gray-600">{userEmail}</span>
                </div>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <Link to="/profile">
                <DropdownMenuItem>
                  <User className="mr-2 h-4 w-4" />
                  <span>My Profile</span>
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem onClick={handleAdminNavigation}>
                <Settings className="mr-2 h-4 w-4" />
                <span>{isInAdminPanel ? "View as User" : "View as Admin"}</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleLogout}
              >
                <LogOut className="mr-2 h-4 w-4" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigationMenu;