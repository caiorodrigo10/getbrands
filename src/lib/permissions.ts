
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";

/**
 * A utility hook that provides user permissions
 * This is a wrapper around useAuthWithPermissions to standardize permission checks
 */
export const useUserPermissions = () => {
  const auth = useAuthWithPermissions();
  
  // More detailed logging to track permission issues
  console.log("useUserPermissions - permissions:", { 
    isAdmin: auth.isAdmin,
    hasFullAccess: auth.hasFullAccess,
    role: auth.role,
    profile: auth.profile
  });
  
  return {
    ...auth,
    // Helper functions for common permission checks
    canAccessAdmin: () => auth.isAdmin === true,
    canAccessProjects: () => auth.hasFullAccess === true || auth.isAdmin === true,
    canAccessDashboard: () => auth.hasFullAccess === true || auth.isAdmin === true
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
