
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
  const { isAuthenticated, isLoading, user } = useAuth();
  const { isAdmin, profile } = useUserPermissions();
  const location = useLocation();

  // Comprehensive admin check from all sources
  const userIsAdmin = 
    isAdmin === true || 
    profile?.role === "admin" || 
    user?.user_metadata?.role === "admin";

  useEffect(() => {
    // Enhanced debugging for admin routes
    if (isAuthenticated && requireAdmin) {
      console.log("ProtectedRoute - ADMIN ACCESS CHECK:", {
        isAdmin,
        userIsAdmin,
        profileRole: profile?.role,
        userMetadataRole: user?.user_metadata?.role,
        path: location.pathname,
        userEmail: user?.email
      });
    }
  }, [isAuthenticated, requireAdmin, isAdmin, userIsAdmin, profile, user, location.pathname]);

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
  
  if (requireAdmin && !userIsAdmin) {
    console.error("Access denied: user is not admin", {
      role: profile?.role,
      userMetadataRole: user?.user_metadata?.role,
      isAdmin,
      path: location.pathname,
      email: user?.email
    });
    
    toast.error("Access denied: You need administrator privileges to access this page");
    return <Navigate to="/catalog" replace />;
  }

  return <>{children}</>;
}
