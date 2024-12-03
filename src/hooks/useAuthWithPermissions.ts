import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthWithPermissions = () => {
  const { user } = useAuth();

  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
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
    gcTime: 1000 * 60 * 60 * 24, // 24 hours
  });

  const isAdmin = profile?.role === "admin";
  const isMember = profile?.role === "member";
  const isSampler = profile?.role === "sampler";
  const hasFullAccess = isAdmin;
  const hasLimitedAccess = isMember || isSampler;
  const isAuthenticated = !!profile;

  return {
    profile,
    isLoading,
    isAdmin,
    isMember,
    isSampler,
    hasFullAccess,
    hasLimitedAccess,
    isAuthenticated
  };
};