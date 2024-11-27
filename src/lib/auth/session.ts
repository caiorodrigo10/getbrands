import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import { ProfileType } from "./types";
import { handleAnalytics, handleGleapIdentification } from "./analytics";
import { getRoleBasedRedirectPath } from "@/lib/roleRedirection";

export const handleUserSession = async (
  user: User | null,
  isInitialLogin = false,
  setUser: (user: User | null) => void,
  navigate: (path: string) => void
) => {
  try {
    if (!user) {
      setUser(null);
      return;
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select(`
        onboarding_completed,
        role,
        first_name,
        last_name,
        phone,
        avatar_url,
        shipping_address_street,
        shipping_address_street2,
        shipping_address_city,
        shipping_address_state,
        shipping_address_zip,
        billing_address_street,
        billing_address_street2,
        billing_city,
        billing_state,
        billing_zip,
        instagram_handle,
        product_interest,
        profile_type,
        brand_status,
        launch_urgency
      `)
      .eq('id', user.id)
      .single();

    if (error) throw error;

    setUser(user);
    
    handleGleapIdentification(user, profile as ProfileType);
    handleAnalytics(user, profile as ProfileType);

    if (isInitialLogin) {
      if (!profile?.onboarding_completed) {
        navigate('/onboarding');
      } else {
        const redirectPath = getRoleBasedRedirectPath(profile?.role);
        navigate(redirectPath);
      }
    }
  } catch (error) {
    console.error('Error in handleUserSession:', error);
    setUser(null);
  }
};