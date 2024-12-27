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
    <header className="border-r border-gray-200 bg-[#fafafa] fixed left-0 top-0 h-screen hidden md:flex md:flex-col w-64 min-h-[600px] overflow-y-auto">
      <div className="flex flex-col h-full min-h-0">
        <div className="p-6 flex-shrink-0">
          <Link to="/catalog">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3 overflow-y-auto">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {hasFullAccess && <ProjectPointsInfo />}
        {(isMember || isSampler) && <ScheduleDemoInfo />}

        <div className="p-4 border-t border-gray-200 mt-auto flex-shrink-0">
          <UserMenu isMobile={false} />
        </div>
      </div>
    </header>
  );
};