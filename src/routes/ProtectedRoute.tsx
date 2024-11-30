import { Navigate, useLocation } from "react-router-dom";
import { isRestrictedRoute } from "@/lib/permissions";
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { Loader2 } from "lucide-react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresAuth?: boolean;
  requiresAdmin?: boolean;
}

export const ProtectedRoute = ({ 
  children, 
  requiresAuth = true,
  requiresAdmin = false,
}: ProtectedRouteProps) => {
  const { 
    isAuthenticated, 
    isLoading,
    hasFullAccess,
  } = useAuthWithPermissions();
  
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!isAuthenticated && requiresAuth && !location.pathname.startsWith('/login')) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiresAdmin && !hasFullAccess) {
    return <Navigate to="/catalog" replace />;
  }

  if (isRestrictedRoute(location.pathname) && !hasFullAccess && !requiresAdmin) {
    return <Navigate to="/start-here" replace />;
  }

  return <>{children}</>;
};