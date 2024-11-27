import { toast } from "sonner";

let analyticsInitialized = false;

const initializeAnalytics = () => {
  if (typeof window === 'undefined') return false;
  if (!window.analytics) return false;
  
  analyticsInitialized = true;
  window.analytics.debug();
  console.log('✅ Segment analytics initialized with write key:', window.analytics._writeKey);
  return true;
};

const waitForAnalytics = () => {
  return new Promise<void>((resolve, reject) => {
    if (analyticsInitialized) {
      resolve();
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;

    const check = () => {
      attempts++;
      if (initializeAnalytics()) {
        resolve();
      } else if (attempts >= maxAttempts) {
        reject(new Error('Failed to initialize analytics after multiple attempts'));
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
    
    const identifyTraits = {
      ...traits,
      lastIdentified: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    };

    window.analytics.identify(userId, identifyTraits);
    console.log('Identify call successful:', { userId, traits: identifyTraits });
  } catch (error) {
    console.error('Error in identify call:', error);
    toast.error('Analytics Error: Failed to identify user');
  }
};

export const trackEvent = async (eventName: string, properties?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    const eventProperties = {
      ...properties,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    };

    window.analytics.track(eventName, eventProperties);
    console.log('Track event:', { eventName, properties: eventProperties });
  } catch (error) {
    console.error('Error tracking event:', error);
    toast.error(`Analytics Error: Failed to track ${eventName}`);
  }
};

export const trackPage = async (properties?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    const pageProperties = {
      url: window.location.href,
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title,
      search: window.location.search,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app',
      ...properties
    };

    window.analytics.page("Page Viewed", pageProperties);
    console.log('Page view:', pageProperties);
  } catch (error) {
    console.error('Error tracking page view:', error);
    toast.error('Analytics Error: Failed to track page view');
  }
};

// Initialize analytics as soon as possible
if (typeof window !== 'undefined') {
  initializeAnalytics();
}