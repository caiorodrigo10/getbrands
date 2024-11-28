import { Link } from "react-router-dom";
import UserMenu from "./UserMenu";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "./ui/button";
import { ProjectPointsInfo } from "./navigation/ProjectPointsInfo";
import { useState } from "react";
import { NavigationLinks } from "./navigation/NavigationLinks";
import { LanguageSwitcher } from "./LanguageSwitcher";

export const NavigationMenu = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Desktop Menu - Vertical */}
      <header className="border-r border-gray-200 bg-[#fafafa] fixed left-0 top-0 h-screen hidden md:block w-64">
        <div className="flex flex-col h-full">
          <div className="p-6">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto"
            />
            <div className="mt-4">
              <LanguageSwitcher />
            </div>
          </div>
          
          <NavigationLinks />
          <ProjectPointsInfo />

          <div className="p-4 border-t border-gray-200">
            <UserMenu isMobile={false} />
          </div>
        </div>
      </header>

      {/* Mobile Menu - Horizontal */}
      <header className="md:hidden fixed top-0 left-0 right-0 border-b border-gray-200 bg-[#fafafa] z-40">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <img 
                src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
                alt="Logo"
                className="h-11 w-auto"
              />
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
                    <NavigationLinks />
                    <div className="p-4 border-t border-gray-200">
                      <ProjectPointsInfo />
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu - Content Padding */}
      <div className="md:hidden h-16" />
    </>
  );
};