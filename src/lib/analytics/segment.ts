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
      // Add any other user traits you want to track
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