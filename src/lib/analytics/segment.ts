interface IdentifyTraits {
  email?: string;
  first_name?: string;
  last_name?: string;
  [key: string]: any;
}

export const identifyUser = (userId: string, traits: IdentifyTraits) => {
  if (window.analytics) {
    window.analytics.identify(userId, traits);
  }
};

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (window.analytics) {
    window.analytics.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString()
    });
  }
};

export const trackPage = (properties: Record<string, any> = {}) => {
  if (window.analytics) {
    window.analytics.page({
      ...properties,
      timestamp: new Date().toISOString()
    });
  }
};

export const resetAnalytics = () => {
  if (window.analytics) {
    window.analytics.reset();
  }
};