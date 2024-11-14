import { Link, useLocation } from "react-router-dom";
import { UserRound, Briefcase, BookOpen, Package, FileText, Box } from "lucide-react";
import UserMenu from "./UserMenu";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: UserRound, label: "My Profile", path: "/perfil" },
    { icon: Briefcase, label: "Projects", path: "/projetos" },
    { icon: BookOpen, label: "Catalog", path: "/catalogo" },
    { icon: Package, label: "My Products", path: "/produtos" },
    { icon: Box, label: "Sample Orders", path: "/sample-orders" },
    { icon: FileText, label: "Documents", path: "/documentos" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-secondary p-6 flex flex-col shadow-xl">
      <div className="mb-8 flex justify-center">
        <img 
          src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
          alt="Mainer Logo"
          className="w-[180px] h-auto object-contain"
        />
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:bg-primary hover:text-primary-foreground ${
                  location.pathname === item.path
                    ? "bg-primary text-primary-foreground font-medium"
                    : "text-white hover:text-primary-foreground"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-6 border-t border-white/10">
        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;