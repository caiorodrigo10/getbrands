
import { LucideIcon, Home, Package2, ListChecks, LayoutDashboard, ShoppingBag, FileText, Calculator, Star } from "lucide-react";

export interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  active?: boolean;
  restricted?: boolean;
}

export const getMenuItems = (showStartHere = false): MenuItem[] => {
  // Base menu items that are always shown
  const baseItems: MenuItem[] = [
    {
      label: "Catalog",
      path: "/catalog",
      icon: Home
    },
    {
      label: "Favorites",
      path: "/favorites",
      icon: Star
    },
    {
      label: "Projects",
      path: "/projects",
      icon: Package2,
      restricted: true
    },
    {
      label: "Products",
      path: "/products",
      icon: ShoppingBag,
      restricted: true
    },
    {
      label: "Sample Orders",
      path: "/sample-orders",
      icon: ListChecks
    },
    {
      label: "Documents",
      path: "/documents",
      icon: FileText,
      restricted: true
    },
    {
      label: "Profit Calculator",
      path: "/profit-calculator",
      icon: Calculator
    }
  ];

  // Conditionally add Start Here at the beginning for Sampler and Member users
  if (showStartHere) {
    return [
      {
        label: "Start Here",
        path: "/start-here",
        icon: LayoutDashboard
      },
      ...baseItems
    ];
  }

  // Add Dashboard for full access users at the beginning
  return [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      restricted: true
    },
    ...baseItems
  ];
};
