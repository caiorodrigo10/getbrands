
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";

/**
 * A utility hook that provides user permissions
 * This is a wrapper around useAuthWithPermissions to standardize permission checks
 */
export const useUserPermissions = () => {
  const auth = useAuthWithPermissions();
  
  console.log("useUserPermissions - permissions:", { 
    isAdmin: auth.isAdmin,
    hasFullAccess: auth.hasFullAccess,
    profile: auth.profile
  });
  
  return {
    ...auth,
    // Helper functions for common permission checks
    canAccessAdmin: () => auth.isAdmin,
    canAccessProjects: () => auth.hasFullAccess || auth.isAdmin,
    canAccessDashboard: () => auth.hasFullAccess || auth.isAdmin
  };
};

/**
 * Gets the user role from the profile
 * Useful for non-React components
 */
export const getUserRole = (profile: any) => {
  if (!profile) return null;
  return profile.role;
};
