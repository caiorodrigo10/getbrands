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

const isDevelopment = import.meta.env.DEV;
const SEGMENT_DEBUG = import.meta.env.VITE_SEGMENT_DEBUG === 'true';

// Track unique sessions to prevent duplicate page views
let currentSessionId: string | null = null;

const getSessionId = () => {
  if (!currentSessionId) {
    currentSessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  return currentSessionId;
};

const shouldTrackEvent = () => {
  // Track events in production or if explicitly enabled for development
  return !isDevelopment || import.meta.env.VITE_FORCE_ANALYTICS === 'true';
};

const debugLog = (type: string, eventName: string, properties?: Record<string, any>) => {
  if (SEGMENT_DEBUG || isDevelopment) {
    console.log(`[Segment ${type}]`, eventName, properties);
  }
};

const ensureAnalyticsLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.analytics) {
      resolve();
      return;
    }

    // Wait for analytics to load
    const checkAnalytics = setInterval(() => {
      if (window.analytics) {
        clearInterval(checkAnalytics);
        resolve();
      }
    }, 100);

    // Timeout after 5 seconds
    setTimeout(() => {
      clearInterval(checkAnalytics);
      console.error('Analytics failed to load after 5 seconds');
      resolve();
    }, 5000);
  });
};

export const trackPage = async (properties?: Record<string, any>) => {
  if (!shouldTrackEvent()) return;

  try {
    await ensureAnalyticsLoaded();
    
    if (window.analytics) {
      const sessionId = getSessionId();
      const enhancedProperties = {
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        search: window.location.search,
        session_id: sessionId,
        environment: isDevelopment ? 'development' : 'production',
        ...properties,
        timestamp: new Date().toISOString(),
      };

      debugLog('Page', 'Page View', enhancedProperties);
      window.analytics.page(enhancedProperties);
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

export const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
  if (!shouldTrackEvent()) return;

  try {
    await ensureAnalyticsLoaded();
    
    if (window.analytics) {
      const sessionId = getSessionId();
      const enhancedProperties = {
        url: window.location.href,
        path: window.location.pathname,
        session_id: sessionId,
        environment: isDevelopment ? 'development' : 'production',
        ...properties,
        timestamp: new Date().toISOString(),
      };

      debugLog('Event', eventName, enhancedProperties);
      window.analytics.track(eventName, enhancedProperties);
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  if (!shouldTrackEvent()) return;

  try {
    await ensureAnalyticsLoaded();
    
    if (window.analytics) {
      const enhancedTraits = {
        ...traits,
        environment: isDevelopment ? 'development' : 'production',
        lastIdentified: new Date().toISOString(),
      };

      debugLog('Identify', userId, enhancedTraits);
      window.analytics.identify(userId, enhancedTraits);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};