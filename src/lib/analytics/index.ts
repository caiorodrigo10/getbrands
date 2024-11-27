import { toast } from "sonner";

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

    console.log('Identify call successful:', { userId, traits });
  } catch (error) {
    console.error('Error in identify call:', error);
    toast.error('Analytics Error: Failed to identify user');
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

    console.log('Track event:', { eventName, properties });
  } catch (error) {
    console.error('Error tracking event:', error);
    toast.error(`Analytics Error: Failed to track ${eventName}`);
  }
};

export const trackPage = (properties?: Record<string, any>) => {
  if (!window.analytics) {
    console.error('Segment analytics not initialized');
    return;
  }

  try {
    const url = new URL(window.location.href);
    window.analytics.page({
      ...properties,
      url: url.toString(),
      path: url.pathname,
      referrer: document.referrer || '',
      title: document.title,
      timestamp: new Date().toISOString(),
    });

    console.log('Page view:', { properties });
  } catch (error) {
    console.error('Error tracking page view:', error);
    toast.error('Analytics Error: Failed to track page view');
  }
};

// Initialize debug mode immediately
window.addEventListener('load', () => {
  if (!window.analytics) {
    console.error('⚠️ Segment analytics not initialized on page load');
    toast.error('Analytics not initialized properly');
  } else {
    console.log('✅ Segment analytics initialized successfully');
    window.analytics.debug();
  }
});