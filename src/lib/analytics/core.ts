declare global {
  interface Window {
    analytics: {
      track: (event: string, properties?: Record<string, any>) => void;
      page: (properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      group: (groupId: string, traits?: Record<string, any>) => void;
      screen: (screenName: string, properties?: Record<string, any>) => void;
    };
  }
}

export const trackPage = (properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.page({
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        search: window.location.search,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.track(eventName, {
        url: window.location.href,
        path: window.location.pathname,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.identify(userId, {
        ...traits,
        lastIdentified: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};