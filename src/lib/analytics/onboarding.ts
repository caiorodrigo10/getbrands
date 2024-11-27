import { trackEvent } from './core';
import type { OnboardingProperties } from './types';

export const trackOnboardingProgress = (properties: OnboardingProperties) => {
  trackEvent('Onboarding Progress', properties);
};

export const trackOnboardingDropoff = (
  abandonmentPoint: string,
  abandonmentReason?: string
) => {
  trackEvent('Onboarding Funnel Dropoff', {
    abandonment_point: abandonmentPoint,
    abandonment_reason: abandonmentReason,
  });
};