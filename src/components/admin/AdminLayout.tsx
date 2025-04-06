
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { useUserPermissions } from "@/lib/permissions";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, profile, isLoading } = useUserPermissions();

  useEffect(() => {
    // Enhanced debugging for admin access
    const userMetadataRole = user?.user_metadata?.role;
    const profileRole = profile?.role;
    
    console.log("AdminLayout - Comprehensive admin check:", {
      isAdmin, 
      profileRole,
      userMetadataRole,
      email: user?.email,
      profile
    });
    
    // Multi-source admin check
    const userIsAdmin = 
      isAdmin === true || 
      profileRole === "admin" || 
      userMetadataRole === "admin";
    
    if (!isLoading && !userIsAdmin) {
      console.log("User is not admin, redirecting from admin area");
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate, profile, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Multi-source admin check for rendering
  const userIsAdmin = 
    isAdmin === true || 
    profile?.role === "admin" || 
    user?.user_metadata?.role === "admin";
  
  if (!userIsAdmin) {
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
