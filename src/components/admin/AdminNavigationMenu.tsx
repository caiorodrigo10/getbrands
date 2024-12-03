import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { UserAvatar } from "@/components/user-menu/UserAvatar";
import { 
  LayoutDashboard, 
  Package2, 
  Users, 
  ShoppingCart, 
  FolderKanban,
  Upload,
  Ticket
} from "lucide-react";

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
  const { user } = useAuth();

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
          <div className="flex items-center gap-3 px-3 py-2">
            <UserAvatar userAvatar={userAvatar} userName={userName} />
            <div className="flex flex-col">
              <span className="text-sm font-medium text-black">{userName}</span>
              <span className="text-xs text-gray-600">{userEmail}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminNavigationMenu;