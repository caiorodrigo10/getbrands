
import { Link } from "react-router-dom";
import UserMenu from "../UserMenu";
import { ProjectPointsInfo } from "./ProjectPointsInfo";
import { ScheduleDemoInfo } from "./ScheduleDemoInfo";
import { MenuItem } from "./types";
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";

interface DesktopNavigationProps {
  menuItems: MenuItem[];
  renderMenuItem: (item: MenuItem) => JSX.Element;
}

export const DesktopNavigation = ({ menuItems, renderMenuItem }: DesktopNavigationProps) => {
  const { hasFullAccess, isMember, isSampler } = useAuthWithPermissions();

  return (
    <header className="border-r border-gray-200 bg-[#fafafa] fixed left-0 top-0 h-screen hidden md:block w-64">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/catalog">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto cursor-pointer"
            />
          </Link>
        </div>
        
        <nav className="flex-1 px-3">
          {menuItems.map(item => renderMenuItem(item))}
        </nav>

        {hasFullAccess && <ProjectPointsInfo />}
        {(isMember || isSampler) && <ScheduleDemoInfo />}

        <div className="p-4 border-t border-gray-200">
          <UserMenu isMobile={false} />
        </div>
      </div>
    </header>
  );
};
