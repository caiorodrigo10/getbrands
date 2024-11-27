import { trackEvent } from "./core";

export const trackOnboardingStarted = (userId: string) => {
  trackEvent("Onboarding Started", {
    user_id: userId,
    timestamp: new Date().toISOString()
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
    timestamp: new Date().toISOString()
  });
};

export const trackOnboardingAbandoned = (lastCompletedStep: number) => {
  trackEvent("Onboarding Abandoned", {
    last_completed_step: lastCompletedStep,
    timestamp: new Date().toISOString()
  });
};