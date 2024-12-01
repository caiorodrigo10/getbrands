import { toast } from "sonner";

const MAX_RETRIES = 3;
const RETRY_DELAY = 1000; // 1 second

const initializeAnalytics = (retryCount = 0): Promise<boolean> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(false);
      return;
    }

    if (window.analytics) {
      resolve(true);
      return;
    }

    if (retryCount >= MAX_RETRIES) {
      console.warn('Failed to initialize analytics after maximum retries');
      resolve(false);
      return;
    }

    setTimeout(() => {
      initializeAnalytics(retryCount + 1).then(resolve);
    }, RETRY_DELAY);
  });
};

export const waitForAnalytics = () => {
  return new Promise<void>((resolve, reject) => {
    initializeAnalytics().then((initialized) => {
      if (initialized) {
        resolve();
      } else {
        reject(new Error('Failed to initialize analytics'));
      }
    });
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

// Add debug logging in development
if (process.env.NODE_ENV === 'development') {
  window.addEventListener('load', () => {
    initializeAnalytics().then((initialized) => {
      console.log(`[Analytics] Initialization ${initialized ? 'successful' : 'failed'}`);
    });
  });
}