import { Link, useLocation } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export const NavigationMenu = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/" },
    { label: "Projects", path: "/projects" },
    { label: "Catalog", path: "/catalog" },
    { label: "My Products", path: "/products" },
    { label: "Profit Calculator", path: "/profit-calculator" },
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
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-4 py-2 text-sm rounded-md transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-primary/20 text-primary-foreground font-medium"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden md:flex">
              <UserMenu isMobile={false} />
            </div>

            <Sheet>
              <SheetTrigger className="md:hidden">
                <Menu className="h-6 w-6 text-gray-300" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[300px] bg-[#131313] p-0">
                <div className="flex flex-col">
                  <div className="p-4 border-b border-gray-800">
                    <UserMenu isMobile={true} />
                  </div>
                  <nav className="flex flex-col p-4">
                    {menuItems.map((item) => (
                      <DropdownMenu key={item.path}>
                        <DropdownMenuTrigger asChild>
                          <Link
                            to={item.path}
                            className={`px-4 py-3 text-sm rounded-md transition-all duration-200 ${
                              location.pathname === item.path
                                ? "bg-primary/20 text-primary-foreground font-medium"
                                : "text-gray-300 hover:bg-gray-800 hover:text-white"
                            }`}
                          >
                            {item.label}
                          </Link>
                        </DropdownMenuTrigger>
                      </DropdownMenu>
                    ))}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
};