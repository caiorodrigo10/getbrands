import { Link, useLocation } from "react-router-dom";
import { UserRound, Briefcase, BookOpen, Package, FileText, Box, Menu } from "lucide-react";
import UserMenu from "./UserMenu";
import { useState } from "react";
import { Button } from "./ui/button";

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  
  const menuItems = [
    { icon: UserRound, label: "My Profile", path: "/perfil" },
    { icon: Briefcase, label: "Projects", path: "/projetos" },
    { icon: BookOpen, label: "Catalog", path: "/catalogo" },
    { icon: Package, label: "My Products", path: "/produtos" },
    { icon: Box, label: "Sample Orders", path: "/sample-orders" },
    { icon: FileText, label: "Documents", path: "/documentos" },
  ];

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        className="fixed top-4 left-4 z-50 md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        <Menu className="h-6 w-6" />
      </Button>

      <aside className={`sidebar-layout bg-secondary p-6 flex flex-col shadow-xl ${isOpen ? 'sidebar-open' : ''}`}>
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
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:bg-primary/10 hover:text-primary ${
                    location.pathname === item.path
                      ? "bg-primary/20 text-primary font-medium"
                      : "text-white hover:text-primary"
                  }`}
                >
                  <item.icon className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium whitespace-nowrap">{item.label}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        
        <div className="mt-auto pt-6 border-t border-white/10">
          <UserMenu />
        </div>
      </aside>

      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
};

export default Sidebar;