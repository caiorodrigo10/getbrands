import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Users, LayoutDashboard, FolderKanban, Settings } from "lucide-react";

const menuItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/admin" },
  { icon: Users, label: "Users", path: "/admin/users" },
  { icon: FolderKanban, label: "Projects", path: "/admin/projects" },
  { icon: Settings, label: "Settings", path: "/admin/settings" },
];

export const AdminSidebar = () => {
  const location = useLocation();

  return (
    <aside className="w-64 bg-white border-r border-gray-200">
      <div className="h-full px-3 py-4 flex flex-col">
        <div className="mb-8 px-4">
          <img
            src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png"
            alt="Mainer Logo"
            className="h-8 w-auto"
          />
        </div>
        
        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={cn(
                  "flex items-center px-4 py-2.5 text-sm font-medium rounded-lg",
                  "transition-colors duration-200",
                  isActive
                    ? "bg-primary text-white"
                    : "text-gray-700 hover:bg-gray-100"
                )}
              >
                <Icon className={cn("h-5 w-5 mr-3", isActive ? "text-white" : "text-gray-400")} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
};