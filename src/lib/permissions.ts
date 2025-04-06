
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";

/**
 * A utility hook that provides user permissions
 * This is a wrapper around useAuthWithPermissions to standardize permission checks
 */
export const useUserPermissions = () => {
  const auth = useAuthWithPermissions();
  const { user } = useAuth();
  
  // Get role from all possible sources to ensure we don't miss any admin role
  const profileRole = auth.profile?.role;
  const userMetadataRole = user?.user_metadata?.role;
  
  // Enhanced admin check considering all potential sources
  const isActuallyAdmin = 
    profileRole === "admin" || 
    userMetadataRole === "admin";
  
  // Debug logging for permissions with more detail
  useEffect(() => {
    console.log("useUserPermissions - Detailed role check:", { 
      profileRole, 
      userMetadataRole, 
      isActuallyAdmin,
      userEmail: user?.email,
      userId: user?.id,
      profileObj: auth.profile,
      userMetadata: user?.user_metadata
    });
  }, [profileRole, userMetadataRole, auth.profile, user]);
  
  return {
    ...auth,
    // Override isAdmin with our enhanced check
    isAdmin: isActuallyAdmin
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
