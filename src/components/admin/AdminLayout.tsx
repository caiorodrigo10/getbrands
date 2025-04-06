
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { useUserPermissions } from "@/lib/permissions";
import { toast } from "sonner";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isLoading } = useUserPermissions();
  
  useEffect(() => {
    // Enhanced debugging for admin access
    console.log("AdminLayout - Access check:", {
      isAdmin, 
      user: user?.id,
      email: user?.email,
      metadataRole: user?.user_metadata?.role,
      currentPath: window.location.pathname
    });
    
    // Only redirect if explicitly not admin - don't redirect during loading
    if (!isLoading && isAdmin === false) {
      console.log("User is not admin, redirecting from admin area");
      toast.error("Access denied: You need administrator privileges to access this page");
      navigate("/catalog");
    }
  }, [isAdmin, isLoading, navigate, user]);

  // Show loading state while checking permissions
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Skip rendering if not admin (prevent flash)
  if (isAdmin === false) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigationMenu />
      <main className="md:pl-64 w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
};
