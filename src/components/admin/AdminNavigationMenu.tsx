import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useSessionManagement } from "@/hooks/useSessionManagement";
import { AdminMenuItems } from "./navigation/AdminMenuItems";
import { AdminUserMenu } from "./navigation/AdminUserMenu";

export const AdminNavigationMenu = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { handleLogout } = useSessionManagement();
  const [isInAdminPanel, setIsInAdminPanel] = useState(true);

  const { data: profile } = useQuery({
    queryKey: ["admin-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  const userName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : "";
  const userEmail = user?.email || "";
  const userAvatar = profile?.avatar_url;

  const handleAdminNavigation = () => {
    if (isInAdminPanel) {
      navigate('/dashboard');
    } else {
      navigate('/admin');
    }
    setIsInAdminPanel(!isInAdminPanel);
  };

  return (
    <div className="fixed left-0 top-0 w-64 h-screen bg-white border-r border-gray-200 z-50">
      <div className="flex flex-col h-full">
        <div className="p-6">
          <Link to="/admin">
            <img 
              src="https://assets.cdn.filesafe.space/Q5OD6tvJPFLSMWrJ9Ent/media/673c037af980e11b5682313e.png"
              alt="Logo"
              className="h-12 w-auto"
            />
          </Link>
        </div>

        <AdminMenuItems location={location} />

        <AdminUserMenu 
          userName={userName}
          userEmail={userEmail}
          userAvatar={userAvatar}
          isInAdminPanel={isInAdminPanel}
          handleAdminNavigation={handleAdminNavigation}
          handleLogout={handleLogout}
        />
      </div>
    </div>
  );
};

export default AdminNavigationMenu;