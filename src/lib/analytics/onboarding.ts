import { trackEvent } from "@/lib/analytics";

export const trackOnboardingStarted = (userId: string, source: string) => {
  trackEvent("onboarding_started", { 
    user_id: userId,
    source: source // 'comecarpt', 'onboarding', 'pt_onboarding'
  });
};

export const trackOnboardingStepCompleted = (
  userId: string,
  step: string,
  stepData: any,
  source: string
) => {
  trackEvent("onboarding_step_completed", {
    user_id: userId,
    step_name: step,
    step_data: stepData,
    source: source
  });
};

export const trackOnboardingCompleted = (userId: string, profileData: any, source: string) => {
  trackEvent("onboarding_completed", {
    user_id: userId,
    profile_type: profileData.profile_type,
    product_interests: profileData.product_interest,
    brand_status: profileData.brand_status,
    source: source,
    language: profileData.language || 'en'
  });
};