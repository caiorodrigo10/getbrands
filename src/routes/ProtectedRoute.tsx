import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissions, isRestrictedRoute } from "@/lib/permissions";

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
  const { isAuthenticated } = useAuth();
  const { hasFullAccess } = useUserPermissions();
  const location = useLocation();

  if (!isAuthenticated && requiresAuth) {
    return <Navigate to="/login" />;
  }

  if (requiresAdmin && !hasFullAccess) {
    return <Navigate to="/catalog" />;
  }

  if (isRestrictedRoute(location.pathname) && !hasFullAccess) {
    return <Navigate to="/start-here" />;
  }

  return <>{children}</>;
};