declare global {
  interface Window {
    analytics: any;
  }
}

export const initializeSegment = (user: any) => {
  if (!window.analytics) {
    console.warn('Segment analytics not initialized');
    return;
  }

  if (user?.id) {
    window.analytics.identify(user.id, {
      email: user.email,
      created_at: user.created_at,
      first_name: user?.first_name,
      last_name: user?.last_name,
      role: user?.role,
      onboarding_completed: user?.onboarding_completed
    });
  }
};

export const trackPageView = (properties: Record<string, any> = {}) => {
  if (!window.analytics) return;
  
  window.analytics.page({
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (!window.analytics) return;

  window.analytics.track(eventName, {
    ...properties,
    timestamp: new Date().toISOString(),
  });
};

export const resetAnalytics = () => {
  if (!window.analytics) return;
  window.analytics.reset();
};