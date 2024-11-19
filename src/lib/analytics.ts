// Type declaration for analytics from Segment
declare global {
  interface Window {
    analytics: {
      track: (event: string, properties?: Record<string, any>) => void;
      page: (properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
    };
  }
}

// Track page views
export const trackPage = (properties?: Record<string, any>) => {
  if (window.analytics) {
    window.analytics.page(properties);
  }
};

// Track specific events
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (window.analytics) {
    window.analytics.track(eventName, properties);
  }
};

// Identify users
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  if (window.analytics) {
    window.analytics.identify(userId, traits);
  }
};