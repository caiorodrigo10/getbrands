
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { useAuth } from "@/contexts/AuthContext";

/**
 * A utility hook that provides user permissions
 * This is a wrapper around useAuthWithPermissions to standardize permission checks
 */
export const useUserPermissions = () => {
  const auth = useAuthWithPermissions();
  const { user } = useAuth();
  
  // Enhanced logging with more comprehensive debug information
  console.log("useUserPermissions - detailed check:", { 
    isAdmin: auth.isAdmin,
    hasFullAccess: auth.hasFullAccess,
    isMember: auth.isMember,
    isSampler: auth.isSampler,
    role: auth.role,
    profileRole: auth.profile?.role,
    userMetadataRole: user?.user_metadata?.role,
    email: user?.email,
    profile: auth.profile
  });
  
  return {
    ...auth,
    // Helper functions with explicit boolean returns for common permission checks
    canAccessAdmin: () => auth.isAdmin === true,
    canAccessProjects: () => auth.hasFullAccess === true || auth.isAdmin === true,
    canAccessDashboard: () => auth.hasFullAccess === true || auth.isAdmin === true
  };
};

/**
 * Gets the user role from various sources
 * Useful for non-React components
 */
export const getUserRole = (profile: any, user: any = null) => {
  if (!profile && !user) return null;
  
  // Check multiple sources in priority order
  return profile?.role || 
         user?.user_metadata?.role || 
         null;
};
