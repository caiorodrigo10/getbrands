
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";
import { useAuth } from "@/contexts/AuthContext";
import { useEffect } from "react";
import { UserRole } from "@/lib/auth/types";

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
  
  // Add specific checks for other roles
  const isCustomer = profileRole === "customer" || userMetadataRole === "customer";
  
  // Debug logging for permissions with more detail
  useEffect(() => {
    console.log("useUserPermissions - Detailed role check:", { 
      profileRole, 
      userMetadataRole, 
      isActuallyAdmin,
      isCustomer,
      userEmail: user?.email,
      userId: user?.id,
      profileObj: auth.profile,
      userMetadata: user?.user_metadata,
      currentPath: window.location.pathname
    });
  }, [profileRole, userMetadataRole, auth.profile, user]);
  
  return {
    ...auth,
    // Override isAdmin with our enhanced check
    isAdmin: isActuallyAdmin,
    // Add customer role check
    isCustomer
  };
};

/**
 * Gets the user role from various sources
 * Useful for non-React components
 */
export const getUserRole = (profile: any, user: any = null): UserRole | null => {
  if (!profile && !user) return null;
  
  // Check multiple sources in priority order
  return (profile?.role || 
         user?.user_metadata?.role || 
         null) as UserRole | null;
};
