import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface NavigationLinkProps {
  path: string;
  icon: LucideIcon;
  label: string;
  restricted?: boolean;
  onClick?: () => void;
}

export const NavigationLink = ({
  path,
  icon: Icon,
  label,
  restricted,
  onClick
}: NavigationLinkProps) => {
  const location = useLocation();
  const { i18n } = useTranslation();
  
  const currentPath = location.pathname.replace(`/${i18n.language}`, '');
  const isActive = currentPath === path;
  const prefixedPath = `/${i18n.language}${path}`;
  
  const baseStyles = cn(
    "flex items-center gap-3 px-4 py-2.5 my-1 text-sm rounded-md transition-all duration-200",
    isActive
      ? "bg-[#fff4fc] text-black font-medium"
      : "text-black hover:bg-[#fff4fc] hover:text-black",
    restricted && "opacity-50 cursor-not-allowed"
  );

  if (onClick) {
    return (
      <button
        className={baseStyles}
        onClick={onClick}
      >
        <Icon className="h-4 w-4" />
        {label}
      </button>
    );
  }

  return (
    <Link
      to={prefixedPath}
      className={baseStyles}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
};