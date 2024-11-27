import { trackEvent } from "@/lib/analytics";

export const trackOnboardingStarted = (userId: string) => {
  trackEvent("Onboarding Started", { user_id: userId });
};

export const trackOnboardingStepCompleted = (
  userId: string,
  step: string,
  stepData: any
) => {
  trackEvent("Onboarding Step Completed", {
    user_id: userId,
    step_name: step,
    step_data: stepData
  });
};

export const trackOnboardingCompleted = (userId: string, profileData: any) => {
  trackEvent("Onboarding Completed", {
    user_id: userId,
    profile_type: profileData.profile_type,
    product_interests: profileData.product_interest,
    brand_status: profileData.brand_status
  });
};