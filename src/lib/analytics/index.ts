import { toast } from "sonner";

let analyticsInitialized = false;
let initializationAttempts = 0;
const MAX_INITIALIZATION_ATTEMPTS = 5;
const INITIALIZATION_RETRY_DELAY = 1000; // 1 second

const initializeAnalytics = () => {
  if (typeof window === 'undefined') return false;
  if (!window.analytics) {
    if (initializationAttempts < MAX_INITIALIZATION_ATTEMPTS) {
      initializationAttempts++;
      console.log(`Attempting to initialize analytics (attempt ${initializationAttempts}/${MAX_INITIALIZATION_ATTEMPTS})`);
      setTimeout(initializeAnalytics, INITIALIZATION_RETRY_DELAY);
      return false;
    }
    console.error('Failed to initialize analytics after maximum attempts');
    return false;
  }
  
  analyticsInitialized = true;
  window.analytics.debug();
  console.log('✅ Segment analytics initialized with write key:', window.analytics._writeKey);
  return true;
};

export const waitForAnalytics = () => {
  return new Promise<void>((resolve, reject) => {
    if (analyticsInitialized) {
      resolve();
      return;
    }

    let attempts = 0;
    const maxAttempts = 10;
    const retryInterval = 1000; // 1 second

    const check = () => {
      attempts++;
      if (initializeAnalytics()) {
        resolve();
      } else if (attempts >= maxAttempts) {
        console.error('Failed to initialize analytics after', maxAttempts, 'attempts');
        reject(new Error('Failed to initialize analytics after multiple attempts'));
      } else {
        setTimeout(check, retryInterval);
      }
    };
    check();
  });
};

const formatUrl = (url: string) => {
  try {
    const urlObj = new URL(url);
    return urlObj.toString();
  } catch (e) {
    console.error('Invalid URL:', url);
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
    console.log('Identify call successful:', { userId, traits: identifyTraits });
  } catch (error) {
    console.error('Error in identify call:', error);
    // Don't show toast for analytics errors to avoid spamming users
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
    // Don't show toast for analytics errors to avoid spamming users
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
    console.log('Page view:', pageProperties);
  } catch (error) {
    console.error('Error tracking page view:', error);
    // Don't show toast for analytics errors to avoid spamming users
  }
};

// Initialize analytics as soon as possible
if (typeof window !== 'undefined') {
  initializeAnalytics();
}