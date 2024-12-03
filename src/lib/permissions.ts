import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type UserRole = 'admin' | 'member' | 'sampler';

export const useUserPermissions = () => {
  const { user } = useAuth();

  const { data: profile } = useQuery({
    queryKey: ["user-profile", user?.id],
    queryFn: async () => {
      if (!user?.id) {
        console.log("[DEBUG] No user ID found");
        return null;
      }
      
      console.log("[DEBUG] Fetching profile for user ID:", user.id);
      
      const { data, error } = await supabase
        .from("profiles")
        .select("*")  // Selecting all fields to see complete profile data
        .eq("id", user.id)
        .single();
      
      if (error) {
        console.error("[DEBUG] Error fetching profile:", error);
        return null;
      }
      
      console.log("[DEBUG] Complete profile data:", data);
      return data;
    },
    enabled: !!user?.id,
    staleTime: 0, // Disable cache to always get the latest role
  });

  const isAdmin = profile?.role === 'admin';
  const isMember = profile?.role === 'member';
  const isSampler = profile?.role === 'sampler';

  console.log("[DEBUG] User role and permissions:", { 
    role: profile?.role,
    isAdmin,
    isMember,
    isSampler,
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