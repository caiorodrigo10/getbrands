export * from './core';
export * from './user';
export * from './onboarding';
export * from './ecommerce';
export * from './catalog';
export * from './engagement';
export * from './project';
export * from './quiz';
export * from './types';

// Add missing exports
export const trackOnboardingStarted = (userId: string) => {
  trackEvent('Onboarding Started', { user_id: userId });
};

export const trackOnboardingStepCompleted = (
  step: number,
  stepName: string,
  data: Record<string, any>
) => {
  trackEvent('Onboarding Step Completed', {
    step,
    step_name: stepName,
    ...data
  });
};

export const trackOnboardingAbandoned = (step: number) => {
  trackEvent('Onboarding Abandoned', { abandoned_at_step: step });
};