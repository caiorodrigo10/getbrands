import { LayoutDashboard, FolderGit2, Grid3X3, Package, Calculator, Package2, PlayCircle } from "lucide-react";

export const getMenuItems = (showStartHere: boolean) => [
  { 
    label: "Dashboard", 
    path: "/dashboard", 
    icon: LayoutDashboard,
    restricted: true
  },
  { 
    label: "Projects", 
    path: "/projects", 
    icon: FolderGit2,
    restricted: true
  },
  { 
    label: "Products", 
    path: "/products", 
    icon: Grid3X3,
    restricted: true
  },
  { 
    label: "Catalog", 
    path: "/catalog", 
    icon: Package,
    restricted: false
  },
  { 
    label: "Profit Calculator", 
    path: "/profit-calculator", 
    icon: Calculator,
    restricted: false
  },
  { 
    label: "Sample Orders", 
    path: "/sample-orders", 
    icon: Package2,
    restricted: false
  },
  ...(showStartHere ? [
    { 
      label: "Get Started", 
      path: "/start-here", 
      icon: PlayCircle,
      restricted: false
    }
  ] : []),
];