
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
        
        // Primeiro tentamos com o cliente regular
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .single();

        if (error) {
          console.error("Error fetching profile with regular client, trying admin client:", error);
          
          // Se falhar, tentamos com o cliente admin
          const { data: adminData, error: adminError } = await supabaseAdmin
            .from("profiles")
            .select("*")
            .eq("id", user.id)
            .single();
            
          if (adminError) {
            console.error("Error fetching profile with admin client:", adminError);
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
          
          return adminData as ProfileType;
        }

        console.log("Profile data from useAuthWithPermissions:", data);
        return data as ProfileType;
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
