import { toast } from "sonner";

const waitForAnalytics = () => {
  return new Promise<void>((resolve) => {
    const check = () => {
      if (window.analytics) {
        resolve();
      } else {
        setTimeout(check, 100);
      }
    };
    check();
  });
};

export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    window.analytics.identify(userId, {
      ...traits,
      lastIdentified: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });

    console.log('Identify call successful:', { userId, traits });
  } catch (error) {
    console.error('Error in identify call:', error);
    toast.error('Analytics Error: Failed to identify user');
  }
};

export const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    window.analytics.track(eventName, {
      ...properties,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });

    console.log('Track event:', { eventName, properties });
  } catch (error) {
    console.error('Error tracking event:', error);
    toast.error(`Analytics Error: Failed to track ${eventName}`);
  }
};

export const trackPage = async (properties?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    const defaultProperties = {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title,
      search: window.location.search,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    };

    window.analytics.page("Page Viewed", {
      ...defaultProperties,
      ...properties
    });

    console.log('Page view:', { ...defaultProperties, ...properties });
  } catch (error) {
    console.error('Error tracking page view:', error);
    toast.error('Analytics Error: Failed to track page view');
  }
};

// Initialize debug mode immediately
window.addEventListener('load', async () => {
  try {
    await waitForAnalytics();
    console.log('✅ Segment analytics initialized successfully');
    window.analytics.debug();
  } catch (error) {
    console.error('⚠️ Segment analytics not initialized on page load');
    toast.error('Analytics not initialized properly');
  }
});