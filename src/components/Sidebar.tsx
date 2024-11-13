import { Link } from "react-router-dom";
import { UserRound, Briefcase, BookOpen, Package, FileText } from "lucide-react";

const Sidebar = () => {
  const menuItems = [
    { icon: UserRound, label: "Meu Perfil", path: "/perfil" },
    { icon: Briefcase, label: "Projetos", path: "/projetos" },
    { icon: BookOpen, label: "Catalogo", path: "/catalogo" },
    { icon: Package, label: "Meus Produtos", path: "/produtos" },
    { icon: FileText, label: "Documentos", path: "/documentos" },
  ];

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-primary p-4 text-white">
      <div className="mb-8 px-4">
        <h1 className="text-2xl font-bold">Mainer</h1>
      </div>
      <nav>
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className="flex items-center gap-3 rounded-lg px-4 py-3 transition-colors hover:bg-primary-light"
              >
                <item.icon className="h-5 w-5" />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;