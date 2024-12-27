import { Link } from "react-router-dom";
import UserMenu from "../UserMenu";
import { ProjectPointsInfo } from "./ProjectPointsInfo";
import { ScheduleDemoInfo } from "./ScheduleDemoInfo";
import { MenuItem } from "./types";
import { useUserPermissions } from "@/lib/permissions";

interface DesktopNavigationProps {
  menuItems: MenuItem[];
  renderMenuItem: (item: MenuItem) => JSX.Element;
}

export const DesktopNavigation = ({ menuItems, renderMenuItem }: DesktopNavigationProps) => {
  const { hasFullAccess, isMember, isSampler } = useUserPermissions();

  return (
    <header className="border-r border-gray-200 bg-[#fafafa] hidden md:flex md:w-64 md:flex-col">
      <div className="flex h-screen flex-col overflow-y-auto">
        <div className="flex-shrink-0 p-6">
          <Link to="/catalog">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="flex-1 space-y-1 px-3 pb-4">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {hasFullAccess && <ProjectPointsInfo />}
        {(isMember || isSampler) && <ScheduleDemoInfo />}

        <div className="flex-shrink-0 p-4 border-t border-gray-200">
          <UserMenu isMobile={false} />
        </div>
      </div>
    </header>
  );
};