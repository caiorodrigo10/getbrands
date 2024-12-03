import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
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
      </div>
    </div>
  );
};

export default AdminNavigationMenu;