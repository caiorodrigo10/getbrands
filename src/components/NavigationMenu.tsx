
import { useLocation, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
import { useState, useEffect } from "react";
import { DesktopNavigation } from "./navigation/DesktopNavigation";
import { MobileNavigation } from "./navigation/MobileNavigation";
import { getMenuItems } from "./navigation/MenuItems";
import { MenuItem } from "./navigation/types";
import { useUserPermissions } from "@/lib/permissions";

export const NavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { hasFullAccess, isMember, isSampler, isAdmin, profile } = useUserPermissions();
  const [isOpen, setIsOpen] = useState(false);

  // Log de permissões para depuração
  useEffect(() => {
    console.log("NavigationMenu - Permissões:", { 
      hasFullAccess, 
      isMember, 
      isSampler, 
      isAdmin,
      profileRole: profile?.role
    });
  }, [hasFullAccess, isMember, isSampler, isAdmin, profile]);

  const showStartHere = isMember || isSampler;
  const menuItems = getMenuItems(showStartHere);

  const handleRestrictedNavigation = (path: string) => {
    if (!hasFullAccess) {
      navigate("/start-here");
      setIsOpen(false);
      return;
    }
    navigate(path);
    setIsOpen(false);
  };

  const renderMenuItem = (item: MenuItem, mobile: boolean = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    const baseStyles = cn(
      "flex items-center gap-3 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200",
      isActive
        ? "bg-[#fff4fc] text-black font-medium"
        : "text-black hover:bg-[#fff4fc] hover:text-black",
      item.restricted && !hasFullAccess && "opacity-50 cursor-not-allowed"
    );

    if (item.restricted && !hasFullAccess) {
      return (
        <button
          key={item.path}
          className={baseStyles}
          onClick={() => handleRestrictedNavigation(item.path)}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </button>
      );
    }

    if (mobile) {
      return (
        <button
          key={item.path}
          className={baseStyles}
          onClick={() => {
            navigate(item.path);
            setIsOpen(false);
          }}
        >
          <Icon className="h-4 w-4" />
          {item.label}
        </button>
      );
    }

    return (
      <Link
        key={item.path}
        to={item.path}
        className={baseStyles}
      >
        <Icon className="h-4 w-4" />
        {item.label}
      </Link>
    );
  };

  return (
    <>
      <DesktopNavigation 
        menuItems={menuItems}
        renderMenuItem={renderMenuItem}
      />
      <MobileNavigation 
        menuItems={menuItems}
        renderMenuItem={renderMenuItem}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};
