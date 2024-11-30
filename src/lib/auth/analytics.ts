import { User } from "@supabase/supabase-js";
import { ProfileType } from "./types";
import Gleap from "gleap";

export const handleAnalytics = async (user: User, profile: ProfileType) => {
  try {
    if (!window.analytics) {
      console.warn('Segment analytics not initialized');
      return;
    }

    // Prepare user traits for Segment
    const traits = {
      email: user.email,
      first_name: profile.first_name,
      last_name: profile.last_name,
      full_name: `${profile.first_name} ${profile.last_name}`.trim(),
      phone: profile.phone,
      avatar_url: profile.avatar_url,
      // Address information
      shipping_address_street: profile.shipping_address_street,
      shipping_address_street2: profile.shipping_address_street2,
      shipping_address_city: profile.shipping_address_city,
      shipping_address_state: profile.shipping_address_state,
      shipping_address_zip: profile.shipping_address_zip,
      // Business/Marketing information
      role: profile.role,
      instagram_handle: profile.instagram_handle,
      product_interest: profile.product_interest,
      profile_type: profile.profile_type,
      brand_status: profile.brand_status,
      launch_urgency: profile.launch_urgency,
      onboarding_completed: profile.onboarding_completed,
      // Metadata
      created_at: user.created_at,
      last_sign_in: user.last_sign_in_at,
      preferred_language: profile.language || 'en'
    };

    // Identify user in Segment
    window.analytics.identify(user.id, traits);

    // Track login event
    window.analytics.track("User Session Started", {
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
      phone: profile.phone,
      plan: profile.role,
      customData: {
        preferredLanguage: profile.language || 'en'
      }
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