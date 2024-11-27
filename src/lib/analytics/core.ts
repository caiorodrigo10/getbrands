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
      console.log('Tracking page view:', {
        url: window.location.href,
        path: window.location.pathname,
        ...properties
      });
      
      window.analytics.page({
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        search: window.location.search,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('Segment analytics not initialized');
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      console.log('Tracking event:', eventName, {
        url: window.location.href,
        path: window.location.pathname,
        ...properties
      });
      
      window.analytics.track(eventName, {
        url: window.location.href,
        path: window.location.pathname,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    } else {
      console.warn('Segment analytics not initialized');
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  try {
    if (window.analytics) {
      console.log('Identifying user:', userId, traits);
      
      window.analytics.identify(userId, {
        ...traits,
        lastIdentified: new Date().toISOString(),
      });
    } else {
      console.warn('Segment analytics not initialized');
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};