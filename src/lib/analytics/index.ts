import { toast } from "sonner";

const initializeAnalytics = () => {
  if (typeof window === 'undefined') return false;
  if (!window.analytics) {
    return false;
  }
  return true;
};

export const waitForAnalytics = () => {
  return new Promise<void>((resolve, reject) => {
    if (initializeAnalytics()) {
      resolve();
      return;
    }
    reject(new Error('Failed to initialize analytics'));
  });
};

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (e) {
    return url;
  }
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
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error in identify call:', error);
    }
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
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking event:', error);
    }
  }
};

export const trackPage = async (properties?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    const pageProperties = {
      url: formatUrl(window.location.href),
      path: window.location.pathname,
      referrer: document.referrer,
      title: document.title,
      search: window.location.search,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app',
      ...properties,
      ...(properties?.url ? { url: formatUrl(properties.url) } : {})
    };

    window.analytics.page(pageProperties.title || "Page Viewed", pageProperties);
  } catch (error) {
    // Silent fail in production
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking page view:', error);
    }
  }
};

// Initialize analytics silently
if (typeof window !== 'undefined') {
  initializeAnalytics();
}