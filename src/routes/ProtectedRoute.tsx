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
  const { isAuthenticated, isLoading } = useAuth();
  const { hasFullAccess } = useUserPermissions();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated && requiresAuth) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiresAdmin && !hasFullAccess) {
    toast.error("You don't have permission to access this area");
    return <Navigate to="/dashboard" replace />;
  }

  if (isRestrictedRoute(location.pathname) && !hasFullAccess) {
    toast.error("You need to upgrade your plan to access this feature");
    return <Navigate to="/checkout/points" replace />;
  }

  return <>{children}</>;
};