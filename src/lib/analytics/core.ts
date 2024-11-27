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
  // Always track events, even in development to ensure proper testing
  return true;
};

const debugLog = (type: string, eventName: string, properties?: Record<string, any>) => {
  if (SEGMENT_DEBUG || isDevelopment) {
    console.log(`[Segment ${type}]`, {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
      environment: isDevelopment ? 'development' : 'production'
    });
  }
};

const ensureAnalyticsLoaded = (): Promise<void> => {
  return new Promise((resolve) => {
    if (window.analytics) {
      resolve();
      return;
    }

    // Wait for analytics to load with increased timeout
    const checkAnalytics = setInterval(() => {
      if (window.analytics) {
        clearInterval(checkAnalytics);
        resolve();
      }
    }, 100);

    // Timeout after 10 seconds (increased from 5)
    setTimeout(() => {
      clearInterval(checkAnalytics);
      console.error('Analytics failed to load after 10 seconds');
      resolve();
    }, 10000);
  });
};

export const trackPage = async (properties?: Record<string, any>) => {
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
    debugLog('Error', 'Page View Error', { error });
  }
};

export const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
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
    debugLog('Error', 'Event Tracking Error', { error, eventName });
  }
};

export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  try {
    await ensureAnalyticsLoaded();
    
    if (window.analytics) {
      const enhancedTraits = {
        ...traits,
        environment: isDevelopment ? 'development' : 'production',
        lastIdentified: new Date().toISOString(),
        user_id: userId, // Ensure user_id is always included
      };

      debugLog('Identify', userId, enhancedTraits);
      window.analytics.identify(userId, enhancedTraits);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
    debugLog('Error', 'User Identification Error', { error, userId });
  }
};