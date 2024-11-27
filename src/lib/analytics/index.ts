// Segment Analytics Implementation
export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  if (window.analytics) {
    window.analytics.identify(userId, traits);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (window.analytics) {
    window.analytics.track(eventName, properties);
  }
};

export const trackPage = (properties?: Record<string, any>) => {
  if (window.analytics) {
    window.analytics.page(properties);
  }
};