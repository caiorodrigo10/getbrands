import { trackEvent } from './core';
import type { ProjectProperties } from './types';

export const trackProjectMetrics = (properties: ProjectProperties) => {
  trackEvent('Project Performance Metrics', properties);
};