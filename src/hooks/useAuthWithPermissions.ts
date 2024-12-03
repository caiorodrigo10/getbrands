import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useAuthWithPermissions = () => {
  const { user } = useAuth();

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
      
      console.log("[DEBUG] Fetching profile for user ID:", user.id);
      
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
      console.log("[DEBUG] Current role:", data?.role);
      
      // Adicionar verificação específica para o email do admin
      if (data?.email === 'caio@avanttocrm.com' && data?.role !== 'admin') {
        console.warn("[DEBUG] Warning: Admin user has incorrect role:", data?.role);
      }

      return data;
    },
    enabled: !!user?.id,
    staleTime: 0, // Desabilitar cache para sempre obter o papel mais recente
    refetchOnWindowFocus: false, // Evitar refetch automático ao focar a janela
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
    isAdmin,
    isMember,
    isSampler,
    hasFullAccess,
    hasLimitedAccess,
  };
};

export const RESTRICTED_ROUTES = [
  '/projects',
  '/products',
];

export const isRestrictedRoute = (pathname: string) => {
  return RESTRICTED_ROUTES.some(route => pathname.startsWith(route));
};