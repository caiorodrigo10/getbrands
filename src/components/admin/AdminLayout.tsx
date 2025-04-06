
import { useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { useUserPermissions } from "@/lib/permissions";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isAdmin, isLoading } = useUserPermissions();
  
  useEffect(() => {
    // Enhanced debugging for admin access
    console.log("AdminLayout - Access check:", {
      isAdmin, 
      email: user?.email,
    });
    
    if (!isLoading && !isAdmin) {
      console.log("User is not admin, redirecting from admin area");
      navigate("/");
    }
  }, [isAdmin, isLoading, navigate, user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAdmin) {
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
