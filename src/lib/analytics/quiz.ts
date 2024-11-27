import { trackEvent } from './core';
import type { QuizProperties } from './types';

export const trackQuizEngagement = (properties: QuizProperties) => {
  trackEvent('Quiz Engagement', properties);
};