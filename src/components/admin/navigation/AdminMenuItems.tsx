import { Link } from "react-router-dom";
import { 
  LayoutDashboard, 
  Package2, 
  Users, 
  ShoppingCart, 
  FolderKanban,
  Upload,
  Ticket
} from "lucide-react";

export const menuItems = [
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

export const AdminMenuItems = ({ location }: { location: { pathname: string } }) => {
  return (
    <nav className="flex-1 px-4 space-y-1">
      {menuItems.map((item) => {
        const isActive = item.exact 
          ? location.pathname === item.href
          : location.pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
              isActive
                ? "bg-[#fff4fc] text-black"
                : "text-gray-600 hover:bg-[#fff4fc] hover:text-black"
            }`}
          >
            <item.icon className="mr-3 h-5 w-5" />
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
};