
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

  // Enhanced logging for debugging
  useEffect(() => {
    console.log("NavigationMenu - Current permissions:", { 
      hasFullAccess, 
      isMember, 
      isSampler, 
      isAdmin,
      profileRole: profile?.role,
      path: location.pathname
    });
  }, [hasFullAccess, isMember, isSampler, isAdmin, profile, location.pathname]);

  // Removed showStartHere parameter as it's no longer needed
  const menuItems = getMenuItems();

  const handleRestrictedNavigation = (path: string) => {
    // Enhanced admin check: ensure admin users can access restricted pages
    if (!hasFullAccess && !isAdmin) {
      console.log("Access restricted: redirecting to catalog", {
        hasFullAccess, 
        isAdmin, 
        userRole: profile?.role
      });
      navigate("/catalog");
      setIsOpen(false);
      return;
    }
    console.log("Navigating to restricted page:", path, {
      hasFullAccess, 
      isAdmin, 
      userRole: profile?.role
    });
    navigate(path);
    setIsOpen(false);
  };

  const renderMenuItem = (item: MenuItem, mobile: boolean = false) => {
    const Icon = item.icon;
    const isActive = location.pathname === item.path;
    
    // Allow admins to access restricted pages
    const isRestricted = item.restricted && !hasFullAccess && !isAdmin;
    
    const baseStyles = cn(
      "flex items-center gap-3 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200",
      isActive
        ? "bg-[#fff4fc] text-black font-medium"
        : "text-black hover:bg-[#fff4fc] hover:text-black",
      isRestricted && "opacity-50 cursor-not-allowed"
    );

    // Route access for restricted areas: special handling for admins
    if (item.restricted && !hasFullAccess && !isAdmin) {
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
        renderMenuItem={(item) => renderMenuItem(item, true)}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
    </>
  );
};
