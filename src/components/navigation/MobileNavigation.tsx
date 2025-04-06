
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import UserMenu from "../UserMenu";
import { ProjectPointsInfo } from "./ProjectPointsInfo";
import { ScheduleDemoInfo } from "./ScheduleDemoInfo";
import { MenuItem } from "./types";
import { useUserPermissions } from "@/lib/permissions";

interface MobileNavigationProps {
  menuItems: MenuItem[];
  renderMenuItem: (item: MenuItem, mobile?: boolean) => JSX.Element;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export const MobileNavigation = ({ 
  menuItems, 
  renderMenuItem, 
  isOpen, 
  setIsOpen 
}: MobileNavigationProps) => {
  const { hasFullAccess, isMember, isSampler, isAdmin } = useUserPermissions();
  
  // Log para depuração
  console.log("MobileNavigation - Permissions:", {
    hasFullAccess,
    isMember,
    isSampler,
    isAdmin
  });
  
  // Corrigindo a lógica de exibição para corresponder à navegação desktop
  const showProjectPoints = hasFullAccess || isAdmin;

  return (
    <>
      <header className="md:hidden fixed top-0 left-0 right-0 border-b border-gray-200 bg-[#fafafa] z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <Link to="/catalog">
                <img 
                  src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
                  alt="Logo"
                  className="h-11 w-auto cursor-pointer"
                />
              </Link>
            </div>

            <div className="flex items-center gap-4">
              <UserMenu isMobile={true} />
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Menu className="h-5 w-5 text-black" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="w-[280px] p-0">
                  <div className="flex flex-col h-full">
                    <nav className="flex-1 overflow-y-auto p-4">
                      {menuItems.map(item => renderMenuItem(item, true))}
                    </nav>
                    {showProjectPoints && <ProjectPointsInfo />}
                    {(isMember || isSampler) && !isAdmin && <ScheduleDemoInfo />}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>
      <div className="md:hidden h-16" />
    </>
  );
};
