import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Gleap from "gleap";

export const PUBLIC_ROUTES = ['/', '/login', '/signup', '/forgot-password'];

export const identifyUserInGleap = async (currentUser: User | null) => {
  if (currentUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name, user_type')
      .eq('id', currentUser.id)
      .single();

    const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : currentUser.email?.split('@')[0] || 'User';
    
    Gleap.identify(currentUser.id, {
      email: currentUser.email,
      name: fullName,
      customData: {
        userType: profile?.user_type
      }
    });
  } else {
    Gleap.clearIdentity();
  }
};

export const checkOnboardingStatus = async (userId: string) => {
  const { data: profile } = await supabase
    .from('profiles')
    .select('onboarding_completed, user_type')
    .eq('id', userId)
    .single();
    
  return {
    onboardingCompleted: profile?.onboarding_completed || false,
    userType: profile?.user_type
  };
};

export const getRedirectPath = (userType: string, onboardingCompleted: boolean) => {
  if (!onboardingCompleted) {
    return '/onboarding';
  }

  switch (userType) {
    case 'admin':
      return '/admin';
    case 'customer':
      return '/dashboard';
    case 'member':
      return '/catalog';
    default:
      return '/dashboard';
  }
};