
import { LucideIcon, Home, Package2, ListChecks, LayoutDashboard, Search, FileText, Calculator, Star } from "lucide-react";

export interface MenuItem {
  label: string;
  path: string;
  icon: LucideIcon;
  active?: boolean;
  restricted: boolean; // Changed from optional to required
}

export const getMenuItems = (showStartHere = false): MenuItem[] => {
  // Main menu items that are always shown, reordered as requested
  const baseItems: MenuItem[] = [
    {
      label: "Dashboard",
      path: "/dashboard",
      icon: LayoutDashboard,
      restricted: true
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
      icon: ListChecks, // Changed from ShoppingBag to ListChecks (Sample Orders icon)
      restricted: true
    },
    {
      label: "Catalog",
      path: "/catalog",
      icon: Search, // Changed from Home to Search (magnifying glass)
      restricted: false
    },
    {
      label: "Favorites",
      path: "/favorites",
      icon: Star,
      restricted: false
    },
    {
      label: "Sample Orders",
      path: "/sample-orders",
      icon: ListChecks,
      restricted: false
    },
    {
      label: "Profit Calculator",
      path: "/profit-calculator",
      icon: Calculator,
      restricted: false
    }
  ];

  // Remove the conditional for showing Start Here
  // Always return the same menu items regardless of role
  return baseItems;
};
