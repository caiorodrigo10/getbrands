import { Navigate, useLocation } from "react-router-dom";
import { isRestrictedRoute } from "@/lib/permissions";
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";

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
    isLoading,
    isAdmin,
    profile
  } = useAuthWithPermissions();
  
  const location = useLocation();
  const isAuthenticated = !!profile;
  const hasFullAccess = isAdmin;

  console.log('[DEBUG] ProtectedRoute - Path:', location.pathname, 'Auth:', isAuthenticated, 'Loading:', isLoading, 'Admin:', hasFullAccess);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated && requiresAuth && !location.pathname.startsWith('/login')) {
    console.log('[DEBUG] ProtectedRoute - Redirecting to login');
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (requiresAdmin && !hasFullAccess) {
    console.log('[DEBUG] ProtectedRoute - No admin access');
    return <Navigate to="/catalog" replace />;
  }

  if (isRestrictedRoute(location.pathname) && !hasFullAccess && !requiresAdmin) {
    console.log('[DEBUG] ProtectedRoute - Restricted route');
    return <Navigate to="/start-here" replace />;
  }

  return <>{children}</>;
};