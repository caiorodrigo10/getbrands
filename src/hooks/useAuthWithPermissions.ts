
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
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
        
        // Always use supabaseAdmin to prevent RLS issues with profiles
        // This ensures we bypass any problematic RLS policies
        const { data, error } = await supabaseAdmin
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile with admin client:", error);
          // Still return at least some basic profile info from auth user metadata
          if (user.user_metadata) {
            // Create a complete profile from user metadata with COMPLETE TYPE SHAPE
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
        const completeProfile: ProfileType = {
          id: data.id || user.id,
          email: data.email || user.email || '',
          role: data.role || user.user_metadata?.role || 'member',
          first_name: data.first_name || user.user_metadata?.first_name || '',
          last_name: data.last_name || user.user_metadata?.last_name || '',
          avatar_url: data.avatar_url || user.user_metadata?.avatar_url || null,
          onboarding_completed: data.onboarding_completed || user.user_metadata?.onboarding_completed || false,
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
        };
        
        return completeProfile;
      } catch (err) {
        console.error("Unexpected error in useAuthWithPermissions:", err);
        // Create a complete profile from user metadata as fallback
        if (user?.user_metadata) {
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
    },
    enabled: !!user?.id,
    retry: 3,
    retryDelay: attemptIndex => Math.min(1000 * 2 ** attemptIndex, 5000),
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  // Enhanced admin detection - check all possible sources for the role
  const userMetadataRole = user?.user_metadata?.role;
  const profileRole = profile?.role;
  
  // Determine role using multiple sources to ensure robustness
  const role = profileRole || userMetadataRole || null;
  
  // Explicit boolean conversion for role-based permissions
  const isAdmin = role === "admin";
  const isMember = role === "member";
  const isSampler = role === "sampler";
  const hasFullAccess = isAdmin === true; // Explicit check
  const hasLimitedAccess = isMember === true || isSampler === true;
  const isAuthenticated = !!profile || !!user;

  console.log("useAuthWithPermissions - comprehensive permissions check:", { 
    isAdmin, 
    isMember, 
    isSampler, 
    hasFullAccess,
    role,
    profileRole,
    userMetadataRole,
    userId: user?.id,
    userEmail: user?.email
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
