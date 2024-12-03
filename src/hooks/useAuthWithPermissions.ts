import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuthWithPermissions = () => {
  const { user, isAuthenticated } = useAuth();

  const { 
    data: profile, 
    isLoading: isLoadingProfile 
  } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("[DEBUG] No user ID found");
        return null;
      }
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("[DEBUG] Error fetching profile:", error);
        return null;
      }
      
      console.log("[DEBUG] Complete profile data:", data);
      return data;
    },
    enabled: !!user?.id && isAuthenticated,
    staleTime: 30000, // Cache por 30 segundos
    cacheTime: 1000 * 60 * 5, // Manter no cache por 5 minutos
    refetchOnWindowFocus: false, // Não refetch ao focar janela
  });

  const isAdmin = profile?.role === 'admin';
  const isMember = profile?.role === 'member';
  const isSampler = profile?.role === 'sampler';

  console.log("[DEBUG] User role and permissions:", { 
    role: profile?.role,
    isAdmin,
    isMember,
    isSampler,
    email: profile?.email,
    profile: profile || 'No profile found'
  });

  const hasFullAccess = isAdmin;
  const hasLimitedAccess = isMember || isSampler;

  return {
    isAuthenticated,
    isLoading: isLoadingProfile,
    isAdmin,
    isMember,
    isSampler,
    hasFullAccess,
    hasLimitedAccess,
    profile
  };
};

export const RESTRICTED_ROUTES = [
  '/projects',
  '/products',
];

export const isRestrictedRoute = (pathname: string) => {
  return RESTRICTED_ROUTES.some(route => pathname.startsWith(route));
};