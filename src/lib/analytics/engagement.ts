import { trackEvent } from './core';
import type { EngagementProperties } from './types';

export const trackMouseHover = (properties: EngagementProperties) => {
  trackEvent('Mouse Hover', properties);
};

export const trackVideoWatched = (properties: EngagementProperties) => {
  trackEvent('Video Watched', properties);
};

export const trackFeatureDropoff = (properties: EngagementProperties) => {
  trackEvent('Feature Dropped Off', properties);
};