import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'member' | 'sampler';

export const useUserPermissions = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;
      
      console.log("Fetching user profile for ID:", user.id); // Debug log
      
      const { data, error } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("Error fetching user profile:", error); // Debug log
        return null;
      }
      
      console.log("User profile data:", data); // Debug log
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0, // Desabilita o cache para sempre pegar o papel mais recente
  });

  const isAdmin = profile?.role === 'admin';
  const isMember = profile?.role === 'member';
  const isSampler = profile?.role === 'sampler';

  console.log("User permissions:", { isAdmin, isMember, isSampler, role: profile?.role }); // Debug log

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