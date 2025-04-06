
import { useAuth } from "@/contexts/AuthContext";
import { Navigate, useLocation } from "react-router-dom";
import { useUserPermissions } from "@/lib/permissions";
import { useEffect } from "react";
import { toast } from "sonner";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({ 
  children, 
  requireAdmin = false 
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const { isAdmin, profile } = useUserPermissions();
  const location = useLocation();

  useEffect(() => {
    if (isAuthenticated && requireAdmin) {
      console.log("ProtectedRoute - Checking admin permission:", {
        isAdmin,
        profileRole: profile?.role,
        path: location.pathname,
        profile
      });
    }
  }, [isAuthenticated, requireAdmin, isAdmin, profile, location.pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Enhanced admin check with better logging
  if (requireAdmin && !isAdmin) {
    console.error("Access denied: user is not admin", {
      role: profile?.role,
      isAdmin,
      path: location.pathname
    });
    
    toast.error("Access denied: You need administrator privileges to access this page");
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
}
