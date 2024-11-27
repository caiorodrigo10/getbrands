import { trackEvent } from "./core";

export const trackOnboardingStarted = (userType: string) => {
  trackEvent("Onboarding Started", {
    user_type: userType,
  });
};

export const trackOnboardingStepCompleted = (
  stepNumber: number, 
  stepName: string, 
  stepData: Record<string, any>
) => {
  trackEvent("Onboarding Step Completed", {
    step_number: stepNumber,
    step_name: stepName,
    ...stepData,
  });
};

export const trackOnboardingCompleted = (userData: Record<string, any>) => {
  trackEvent("Onboarding Completed", {
    ...userData,
  });
};

export const trackOnboardingAbandoned = (
  lastCompletedStep: number,
  reason?: string
) => {
  trackEvent("Onboarding Abandoned", {
    last_completed_step: lastCompletedStep,
    reason: reason,
  });
};