import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { NavigationLink } from "./NavigationLink";
import { useUserPermissions } from "@/lib/permissions";
import {
  LayoutDashboard,
  FolderGit2,
  Grid3X3,
  Palette,
  Calculator,
  Package2,
  PlayCircle
} from "lucide-react";

export const NavigationLinks = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { hasFullAccess, isMember, isSampler } = useUserPermissions();
  const showStartHere = isMember || isSampler;

  const handleRestrictedNavigation = (path: string) => {
    if (!hasFullAccess) {
      navigate(`/${i18n.language}/start-here`);
      return;
    }
    navigate(`/${i18n.language}${path}`);
  };

  const menuItems = [
    {
      label: t('navigation.dashboard'),
      path: "/dashboard",
      icon: LayoutDashboard,
      restricted: false
    },
    {
      label: t('navigation.projects'),
      path: "/projects",
      icon: FolderGit2,
      restricted: true
    },
    {
      label: t('navigation.products'),
      path: "/products",
      icon: Grid3X3,
      restricted: true
    },
    {
      label: t('navigation.catalog'),
      path: "/catalog",
      icon: Palette,
      restricted: false
    },
    {
      label: t('navigation.profitCalculator'),
      path: "/profit-calculator",
      icon: Calculator,
      restricted: false
    },
    {
      label: t('navigation.sampleOrders'),
      path: "/sample-orders",
      icon: Package2,
      restricted: false
    },
    ...(showStartHere ? [{
      label: t('navigation.getStarted'),
      path: "/start-here",
      icon: PlayCircle,
      restricted: false
    }] : [])
  ];

  return (
    <nav className="flex-1 px-3">
      {menuItems.map((item) => (
        <NavigationLink
          key={item.path}
          {...item}
          onClick={item.restricted ? () => handleRestrictedNavigation(item.path) : undefined}
        />
      ))}
    </nav>
  );
};