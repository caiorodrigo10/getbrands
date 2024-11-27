import { initializeAnalytics, identifyUser, trackEvent } from './initialize';

export const initializeSegment = (user: any) => {
  initializeAnalytics();
  
  if (user?.id) {
    identifyUser(user, {
      first_name: user?.first_name,
      last_name: user?.last_name,
      role: user?.role,
      onboarding_completed: user?.onboarding_completed
    });
  }
};

export const trackPageView = (properties: Record<string, any> = {}) => {
  if (!window.analytics) return;
  
  window.analytics.ready(() => {
    window.analytics.page({
      ...properties,
      timestamp: new Date().toISOString(),
    });
  });
};

export const resetAnalytics = () => {
  if (!window.analytics) return;
  
  window.analytics.ready(() => {
    window.analytics.reset();
    console.log('Analytics reset completed');
  });
};

// Re-export core tracking functions
export { trackEvent };