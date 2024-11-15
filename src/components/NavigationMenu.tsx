import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, BookOpen, Pill, Calculator } from "lucide-react";
import UserMenu from "./UserMenu";

export const NavigationMenu = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: BookOpen, label: "Catalog", path: "/catalog" },
    { icon: Pill, label: "My Products", path: "/products" },
    { icon: Calculator, label: "Profit Calculator", path: "/profit-calculator" },
  ];

  return (
    <header className="border-b border-border/40 bg-[#131313]">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <img 
              src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
              alt="Mainer Logo"
              className="h-8 w-auto"
            />
            <nav className="hidden md:flex items-center gap-2">
              {menuItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-2 px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                      location.pathname === item.path
                        ? "bg-primary/20 text-primary-foreground font-medium"
                        : "text-gray-300 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <UserMenu />
          </div>
        </div>
      </div>
    </header>
  );
};