import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuthWithPermissions = () => {
  const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth();

  const { 
    data: profile, 
    isLoading: isLoadingProfile 
  } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
    staleTime: 1000 * 60 * 5, // Cache por 5 minutos
    cacheTime: 1000 * 60 * 30, // Manter no cache por 30 minutos
  });

  const isAdmin = profile?.role === 'admin';
  const isMember = profile?.role === 'member';
  const isSampler = profile?.role === 'sampler';

  const hasFullAccess = isAdmin;
  const hasLimitedAccess = isMember || isSampler;

  const isLoading = isLoadingAuth || (isAuthenticated && isLoadingProfile);

  return {
    user,
    isAuthenticated,
    isLoading,
    profile,
    isAdmin,
    isMember,
    isSampler,
    hasFullAccess,
    hasLimitedAccess,
  };
};
