import { Link, useLocation } from "react-router-dom";
import { UserRound, Briefcase, BookOpen, Package, FileText } from "lucide-react";
import UserMenu from "./UserMenu";

const Sidebar = () => {
  const location = useLocation();
  const menuItems = [
    { icon: UserRound, label: "Meu Perfil", path: "/perfil" },
    { icon: Briefcase, label: "Projetos", path: "/projetos" },
    { icon: BookOpen, label: "Catalogo", path: "/catalogo" },
    { icon: Package, label: "Meus Produtos", path: "/produtos" },
    { icon: FileText, label: "Documentos", path: "/documentos" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-48 bg-gray-900 p-4 text-white flex flex-col">
      <div className="mb-8 px-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-primary">Mainer</h1>
      </div>
      <nav className="flex-1">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gray-800 hover:text-primary ${
                  location.pathname === item.path
                    ? "bg-gray-800 text-primary"
                    : "text-gray-400"
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-auto pt-4 border-t border-gray-800">
        <UserMenu />
      </div>
    </aside>
  );
};

export default Sidebar;