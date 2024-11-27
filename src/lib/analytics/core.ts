import { SegmentAnalyticsJS } from './types/segment';
import { SEGMENT_WRITE_KEY, shouldTrackEvent, debugLog } from './config';
import { getSessionId } from './session';

const loadSegment = async () => {
  if (!SEGMENT_WRITE_KEY) {
    console.error('Segment write key is not configured');
    return;
  }

  // Initialize Segment
  const analytics = window.analytics = window.analytics || [] as SegmentAnalyticsJS;
  
  if (!analytics.initialize) {
    if (analytics.invoked) {
      console.error('Segment snippet included twice.');
      return;
    }
    analytics.invoked = true;
    analytics.methods = [
      'trackSubmit',
      'trackClick',
      'trackLink',
      'trackForm',
      'pageview',
      'identify',
      'reset',
      'group',
      'track',
      'ready',
      'alias',
      'debug',
      'page',
      'screen',
      'once',
      'off',
      'on',
      'addSourceMiddleware',
      'addIntegrationMiddleware',
      'setAnonymousId',
      'addDestinationMiddleware'
    ];
    analytics.factory = function(method: string) {
      return function() {
        const args = Array.prototype.slice.call(arguments);
        args.unshift(method);
        analytics.push(args);
        return analytics;
      };
    };
    for (const method of analytics.methods) {
      analytics[method] = analytics.factory(method);
    }
  }

  // Load Segment script
  const script = document.createElement('script');
  script.type = 'text/javascript';
  script.async = true;
  script.src = `https://cdn.segment.com/analytics.js/v1/${SEGMENT_WRITE_KEY}/analytics.min.js`;
  
  const firstScript = document.getElementsByTagName('script')[0];
  firstScript.parentNode?.insertBefore(script, firstScript);
};

const ensureAnalyticsLoaded = async (): Promise<void> => {
  if (!window.analytics) {
    await loadSegment();
  }

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
        environment: import.meta.env.DEV ? 'development' : 'production',
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
        environment: import.meta.env.DEV ? 'development' : 'production',
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
        environment: import.meta.env.DEV ? 'development' : 'production',
        lastIdentified: new Date().toISOString(),
      };

      debugLog('Identify', userId, enhancedTraits);
      window.analytics.identify(userId, enhancedTraits);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};