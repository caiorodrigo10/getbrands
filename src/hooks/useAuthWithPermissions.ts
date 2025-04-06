
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

      if (error) {
        console.error("Erro ao buscar perfil:", error);
        return null;
      }
      
      console.log("Dados do perfil de useAuthWithPermissions:", data);
      return data;
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 10000),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutos
  });

  // Verificação mais robusta e detalhada para papeis de usuário
  const role = profile?.role || null;
  const isAdmin = role === "admin";
  const isMember = role === "member";
  const isSampler = role === "sampler";
  const hasFullAccess = isAdmin;
  const hasLimitedAccess = isMember || isSampler;
  const isAuthenticated = !!profile;

  console.log("useAuthWithPermissions - permissões calculadas:", { 
    isAdmin, 
    isMember, 
    isSampler, 
    hasFullAccess,
    role,
    userId: user?.id
  });

  return {
    profile,
    isLoading,
    isAdmin,
    isMember,
    isSampler,
    hasFullAccess,
    hasLimitedAccess,
    isAuthenticated,
    role
  };
};
