import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useUserPermissions, isRestrictedRoute } from "@/lib/permissions";
import { toast } from "sonner";

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
    toast.error("You don't have permission to access this area");
    return <Navigate to="/dashboard" />;
  }

  if (isRestrictedRoute(location.pathname) && !hasFullAccess) {
    toast.error("You need to upgrade your plan to access this feature");
    return <Navigate to="/checkout/points" />;
  }

  return <>{children}</>;
};