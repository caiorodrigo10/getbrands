import { toast } from "sonner";

const SEGMENT_DEBUG = process.env.NODE_ENV === 'development';

export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  if (!window.analytics) {
    console.error('Segment analytics not initialized');
    return;
  }

  try {
    window.analytics.identify(userId, {
      ...traits,
      lastIdentified: new Date().toISOString(),
    });

    if (SEGMENT_DEBUG) {
      console.log('Identify call successful:', { userId, traits });
    }
  } catch (error) {
    console.error('Error in identify call:', error);
    if (SEGMENT_DEBUG) {
      toast.error('Analytics Error: Failed to identify user');
    }
  }
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  if (!window.analytics) {
    console.error('Segment analytics not initialized');
    return;
  }

  try {
    window.analytics.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });

    if (SEGMENT_DEBUG) {
      console.log('Track event:', { eventName, properties });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
    if (SEGMENT_DEBUG) {
      toast.error(`Analytics Error: Failed to track ${eventName}`);
    }
  }
};

export const trackPage = (properties?: Record<string, any>) => {
  if (!window.analytics) {
    console.error('Segment analytics not initialized');
    return;
  }

  try {
    window.analytics.page("Page View", {
      ...properties,
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title,
      timestamp: new Date().toISOString(),
    });

    if (SEGMENT_DEBUG) {
      console.log('Page view:', { properties });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
    if (SEGMENT_DEBUG) {
      toast.error('Analytics Error: Failed to track page view');
    }
  }
};

// Initialize debug mode in development
if (SEGMENT_DEBUG) {
  window.addEventListener('load', () => {
    if (!window.analytics) {
      console.error('⚠️ Segment analytics not initialized on page load');
      toast.error('Analytics not initialized properly');
    } else {
      console.log('✅ Segment analytics initialized successfully');
      window.analytics.debug();
    }
  });
}