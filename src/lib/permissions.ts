
import { useAuthWithPermissions } from "@/hooks/useAuthWithPermissions";

/**
 * A utility hook that provides user permissions
 * This is a wrapper around useAuthWithPermissions to standardize permission checks
 */
export const useUserPermissions = () => {
  return useAuthWithPermissions();
};
