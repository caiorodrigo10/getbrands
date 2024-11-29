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
      const { data } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();
      return data;
    },
    enabled: !!user?.id,
  });

  const isAdmin = profile?.role === 'admin';
  const isMember = profile?.role === 'member';
  const isSampler = profile?.role === 'sampler';

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
  '/dashboard'
];

export const isRestrictedRoute = (pathname: string) => {
  return RESTRICTED_ROUTES.some(route => pathname.includes(route));
};