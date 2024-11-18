import { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import Gleap from "gleap";
import { NavigateFunction } from "react-router-dom";

export const identifyUserInGleap = async (currentUser: User | null) => {
  if (currentUser) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('first_name, last_name')
      .eq('id', currentUser.id)
      .single();

    const fullName = profile ? `${profile.first_name} ${profile.last_name}`.trim() : currentUser.email?.split('@')[0] || 'User';
    
    Gleap.identify(currentUser.id, {
      email: currentUser.email,
      name: fullName,
    });
  } else {
    Gleap.clearIdentity();
  }
};

export const handleProfileBasedRedirect = async (currentUser: User, navigate: NavigateFunction) => {
  try {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role, user_type')
      .eq('id', currentUser.id)
      .single();

    if (profile) {
      if (profile.user_type === 'Customer') {
        navigate('/dashboard', { replace: true });
      } else if (['Member', 'Sampler'].includes(profile.user_type)) {
        navigate('/start-here', { replace: true });
      }
    }
  } catch (error) {
    console.error('Error fetching profile:', error);
    navigate('/dashboard', { replace: true }); // Default fallback
  }
};