import { Link, useLocation } from "react-router-dom";
import { Menu, LayoutDashboard, Users, FolderGit2, Grid3X3, Package2, FileText } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import UserMenu from "@/components/UserMenu";

export const AdminNavigationMenu = () => {
  const location = useLocation();

  const menuItems = [
    { label: "Dashboard", path: "/admin", icon: LayoutDashboard },
    { label: "Projects", path: "/admin/projects", icon: FolderGit2 },
    { label: "CRM", path: "/admin/crm", icon: Users },
    { label: "Catalog", path: "/admin/catalog", icon: Grid3X3 },
    { label: "Orders", path: "/admin/orders", icon: Package2 },
    { label: "Reports", path: "/admin/reports", icon: FileText },
  ];

  return (
    <>
      {/* Desktop Menu - Vertical */}
      <header className="border-r border-gray-200 bg-[#fafafa] fixed left-0 top-0 h-screen hidden md:block w-64">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <img 
              src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
              alt="Mainer Logo"
              className="h-8 w-auto"
            />
            <div className="mt-2 text-sm text-gray-600">
              Admin Panel
            </div>
          </div>
          
          <nav className="flex-1 px-3">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200 ${
                    location.pathname === item.path
                      ? "bg-[#f8dafc] text-gray-900 font-medium"
                      : "text-gray-600 hover:bg-[#f8dafc] hover:text-gray-900"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="p-4 border-t border-gray-200">
            <UserMenu isMobile={false} />
          </div>
        </div>
      </header>

      {/* Mobile Menu - Horizontal */}
      <header className="md:hidden fixed top-0 left-0 right-0 border-b border-gray-200 bg-[#fafafa]">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://content.app-sources.com/s/97257455971736356/uploads/Logos/Logotipo_4-7282325.png?format=webp"
                alt="Mainer Logo"
                className="h-8 w-auto"
              />
              <div className="text-sm text-gray-600">
                Admin Panel
              </div>
            </div>

            <Sheet>
              <SheetTrigger>
                <Menu className="h-6 w-6 text-gray-600" />
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] bg-[#fafafa] p-0">
                <div className="flex flex-col">
                  <div className="p-4 border-b border-gray-200">
                    <UserMenu isMobile={true} />
                  </div>
                  <nav className="flex flex-col p-4">
                    {menuItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <Link
                          key={item.path}
                          to={item.path}
                          className={`flex items-center gap-3 px-4 py-3 text-sm rounded-md transition-all duration-200 ${
                            location.pathname === item.path
                              ? "bg-[#f8dafc] text-gray-900 font-medium"
                              : "text-gray-600 hover:bg-[#f8dafc] hover:text-gray-900"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                          {item.label}
                        </Link>
                      );
                    })}
                  </nav>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>
    </>
  );
};