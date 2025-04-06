
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { ProfileType } from "@/lib/auth/types";

export const useAuthWithPermissions = () => {
  const { user } = useAuth();

  // Enhanced profile query with better error handling and retry logic
  const { data: profile, isLoading } = useQuery({
    queryKey: ["profile", user?.id],
    queryFn: async () => {
      if (!user?.id) return null;

      try {
        console.log("Fetching profile for user:", user.id);
        
        // First try to get user role from profiles table
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile:", error);
          // Still return at least some basic profile info from auth user metadata
          if (user.user_metadata) {
            // Create a complete profile from user metadata with COMPLETE TYPE SHAPE
            // Make sure all possible profile fields are included with fallbacks
            return {
              id: user.id,
              email: user.email || '',
              role: user.user_metadata.role || 'member',
              first_name: user.user_metadata.first_name || '',
              last_name: user.user_metadata.last_name || '',
              avatar_url: user.user_metadata.avatar_url || null,
              onboarding_completed: user.user_metadata.onboarding_completed || false,
              phone: null,
              shipping_address_street: null,
              shipping_address_street2: null,
              shipping_address_city: null,
              shipping_address_state: null,
              shipping_address_zip: null,
              billing_address_street: null,
              billing_address_street2: null,
              billing_city: null,
              billing_state: null,
              billing_zip: null,
              instagram_handle: null,
              product_interest: null,
              profile_type: null,
              brand_status: null,
              launch_urgency: null,
              language: 'en'
            } as ProfileType;
          }
          return null;
        }

        console.log("Profile data from useAuthWithPermissions:", data);
        
        // Create a complete profile object with fallbacks to user metadata
        // Ensure ALL fields are present in the returned object
        return {
          ...data,
          id: data.id || user.id,
          email: data.email || user.email || '',
          // Ensure these critical fields have fallbacks
          first_name: data.first_name || user.user_metadata?.first_name || '',
          last_name: data.last_name || user.user_metadata?.last_name || '',
          avatar_url: data.avatar_url || user.user_metadata?.avatar_url || null,
          role: data.role || user.user_metadata?.role || 'member',
          onboarding_completed: data.onboarding_completed || user.user_metadata?.onboarding_completed || false,
          // Ensure all other profile fields have at least null values if not present
          phone: data.phone || null,
          shipping_address_street: data.shipping_address_street || null,
          shipping_address_street2: data.shipping_address_street2 || null,
          shipping_address_city: data.shipping_address_city || null,
          shipping_address_state: data.shipping_address_state || null,
          shipping_address_zip: data.shipping_address_zip || null,
          billing_address_street: data.billing_address_street || null,
          billing_address_street2: data.billing_address_street2 || null,
          billing_city: data.billing_city || null,
          billing_state: data.billing_state || null,
          billing_zip: data.billing_zip || null,
          instagram_handle: data.instagram_handle || null,
          product_interest: data.product_interest || null,
          profile_type: data.profile_type || null,
          brand_status: data.brand_status || null,
          launch_urgency: data.launch_urgency || null,
          language: data.language || 'en'
        } as ProfileType;
      } catch (err) {
        console.error("Unexpected error in useAuthWithPermissions:", err);
        return null;
      }
    },
    enabled: !!user?.id,
    retry: 3,
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
    userMetadata: user?.user_metadata,
    profileData: profile
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
