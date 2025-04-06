
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useAuthWithPermissions = () => {
  const { user } = useAuth();

  // Enhanced profile query with better error handling and retry logic
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        // First try to get user role from profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // Still return at least some basic profile info from auth user metadata
          // This provides a fallback if RLS prevents access to profiles table
          if (user.user_metadata) {
            return {
              id: user.id,
              role: user.user_metadata.role || 'member',
              email: user.email,
              first_name: user.user_metadata.first_name,
              last_name: user.user_metadata.last_name,
              avatar_url: user.user_metadata.avatar_url,
              onboarding_completed: user.user_metadata.onboarding_completed || false
            };
          }
          return null;
        }

        console.log("Profile data from useAuthWithPermissions:", data);
        return data;
      } catch (err) {
        console.error("Unexpected error in useAuthWithPermissions:", err);
        return null;
      }
    },
    enabled: !!user?.id,
    retry: 2,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Get role from multiple potential sources to ensure robustness
  // Use explicit checks to avoid type coercion issues
  const role = profile?.role || user?.user_metadata?.role || null;
  
  // Explicit boolean conversion using strict equality for safety
  const isAdmin = role === "admin";
  const isMember = role === "member";
  const isSampler = role === "sampler";
  const hasFullAccess = isAdmin === true; // Explicit check
  const hasLimitedAccess = isMember === true || isSampler === true;
  const isAuthenticated = !!profile || !!user;

  console.log("useAuthWithPermissions - detailed permissions check:", { 
    isAdmin, 
    isMember, 
    isSampler, 
    hasFullAccess,
    role,
    userId: user?.id,
    userEmail: user?.email,
    userMetadata: user?.user_metadata
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
