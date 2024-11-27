import { trackEvent } from './core';
import type { UserProperties } from './types';

export const trackSignUp = (properties: UserProperties) => {
  trackEvent('User Signed Up', properties);
};

export const trackProfileUpdate = (
  updatedFields: string[],
  previousValues: Record<string, any>
) => {
  trackEvent('User Profile Updated', {
    updated_fields: updatedFields,
    previous_values: previousValues,
  });
};

export const trackPreferencesSaved = (preferences: Record<string, any>) => {
  trackEvent('User Preferences Saved', { preferences });
};