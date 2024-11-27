import { trackEvent } from './core';
export * from './core';
export * from './user';
export * from './onboarding';
export * from './ecommerce';
export * from './catalog';
export * from './engagement';
export * from './project';
export * from './quiz';
export * from './types';

// Add missing exports with correct types
export const trackOnboardingStarted = (properties: Record<string, any>) => {
  trackEvent('Onboarding Started', properties);
};

export const trackOnboardingStepCompleted = (properties: Record<string, any>) => {
  trackEvent('Onboarding Step Completed', properties);
};

export const trackOnboardingAbandoned = (properties: Record<string, any>) => {
  trackEvent('Onboarding Abandoned', properties);
};