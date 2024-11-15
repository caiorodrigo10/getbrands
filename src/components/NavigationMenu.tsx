import { Link, useLocation } from "react-router-dom";
import { LayoutDashboard, Briefcase, BookOpen, Pill, ShoppingBag, Calculator, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import UserMenu from "./UserMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useState } from "react";
import PackSelectionDialog from "./dialogs/PackSelectionDialog";

export const NavigationMenu = () => {
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
    <header className="border-b border-border/40 bg-[#1A1F2C]">
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
            <div className="hidden md:flex items-center gap-3">
              <span className="text-gray-300 text-sm font-medium">
                {totalPoints?.toLocaleString() || 0} pts
              </span>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setIsPackDialogOpen(true)}
                className="bg-white/10 text-white hover:bg-white/20 transition-colors"
              >
                Get Pack
              </Button>
            </div>
            <UserMenu />
          </div>
        </div>
      </div>

      <PackSelectionDialog 
        open={isPackDialogOpen} 
        onOpenChange={setIsPackDialogOpen}
      />
    </header>
  );
};