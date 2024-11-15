import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { AdminNavigationMenu } from "./AdminNavigationMenu";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["admin-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!isLoading && profile?.role !== "admin") {
      navigate("/");
    }
  }, [profile, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (profile?.role !== "admin") {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <AdminNavigationMenu />
      <main className="md:pl-64 w-full">
        <div className="max-w-[1200px] mx-auto px-4 py-6 mt-16 md:mt-0">
          {children}
        </div>
      </main>
    </div>
  );
};