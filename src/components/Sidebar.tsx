import { Link, useLocation } from "react-router-dom";
import { Briefcase, BookOpen, Pill, ShoppingBag, Calculator, PlusCircle, LayoutDashboard } from "lucide-react";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import PackSelectionDialog from "./dialogs/PackSelectionDialog";

const Sidebar = () => {
  const location = useLocation();
  const { user } = useAuth();
  const [isPackDialogOpen, setIsPackDialogOpen] = useState(false);

  const { data: totalPoints } = useQuery({
    queryKey: ["userPoints", user?.id],
    queryFn: async () => {
      if (!user?.id) return 0;
      const { data: projects } = await supabase
        .from("projects")
        .select("points, points_used")
        .eq("user_id", user.id);

      if (!projects) return 0;
      
      return projects.reduce((acc, project) => {
        return acc + (project.points - (project.points_used || 0));
      }, 0);
    },
    enabled: !!user?.id,
  });

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Briefcase, label: "Projects", path: "/projects" },
    { icon: BookOpen, label: "Catalog", path: "/catalog" },
    { icon: Pill, label: "My Products", path: "/products" },
    { icon: ShoppingBag, label: "Orders", path: "/sample-orders" },
    { icon: Calculator, label: "Profit Calculator", path: "/profit-calculator" },
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
                className={`flex items-center gap-3 rounded-lg px-4 py-3 text-sm transition-all duration-200 hover:bg-gray-100/10 ${
                  location.pathname === item.path
                    ? "bg-gray-100/20 text-white font-medium"
                    : "text-white hover:text-white"
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="mt-auto space-y-4">
        <div className="p-4 bg-white/10 rounded-lg">
          <p className="text-white text-sm mb-1">Available Points</p>
          <p className="text-white font-bold text-xl">{totalPoints || 0} pts</p>
          <button
            onClick={() => setIsPackDialogOpen(true)}
            className="mt-2 w-full flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span className="text-sm font-medium">Get Pack</span>
          </button>
        </div>
        
        <div className="pt-6 border-t border-white/10">
          <UserMenu />
        </div>
      </div>

      <PackSelectionDialog 
        open={isPackDialogOpen} 
        onOpenChange={setIsPackDialogOpen}
      />
    </aside>
  );
};

export default Sidebar;