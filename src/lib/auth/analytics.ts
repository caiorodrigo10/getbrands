import { User } from "@supabase/supabase-js";
import { identifyUser, trackEvent } from "@/lib/analytics";
import { ProfileType } from "./types";
import Gleap from "gleap";

export const handleAnalytics = async (user: User, profile: ProfileType) => {
  try {
    await identifyUser(user.id, {
      email: user.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`.trim(),
      role: profile.role,
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      onboarding_completed: profile.onboarding_completed,
    });

    await trackEvent("User Logged In", {
      user_id: user.id,
      email: user.email,
      login_method: "email",
      role: profile.role,
    });
  } catch (error) {
    console.error('Analytics error:', error);
  }
};

export const handleGleapIdentification = (user: User, profile: ProfileType) => {
  try {
    Gleap.identify(user.id, {
      email: user.email,
      name: profile.first_name ? `${profile.first_name} ${profile.last_name}` : user.email,
    });
  } catch (error) {
    console.error('Gleap error:', error);
  }
};

export const clearGleapIdentity = () => {
  try {
    Gleap.clearIdentity();
  } catch (error) {
    console.error('Gleap error:', error);
  }
};