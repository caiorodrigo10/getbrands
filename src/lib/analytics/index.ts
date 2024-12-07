import { toast } from 'sonner';

let analyticsInitialized = false;

const initializeAnalytics = () => {
  if (typeof window === 'undefined') return false;
  if (!window.analytics) return false;
  
  analyticsInitialized = true;
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
        console.log('[Analytics] Initialized successfully');
        resolve();
      } else if (attempts >= maxAttempts) {
        console.error('[Analytics] Failed to initialize after multiple attempts');
        reject(new Error('Failed to initialize analytics after multiple attempts'));
      } else {
        setTimeout(check, 100);
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

    console.log('[Analytics] Identifying user:', userId, identifyTraits);
    window.analytics.identify(userId, identifyTraits);
  } catch (error) {
    console.error('[Analytics] Error identifying user:', error);
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

    console.log('[Analytics] Tracking event:', eventName, eventProperties);
    window.analytics.track(eventName, eventProperties);
  } catch (error) {
    console.error('[Analytics] Error tracking event:', error);
    toast.error(`Analytics Error: Failed to track ${eventName}`);
  }
};

export const trackPage = async (properties?: Record<string, any>) => {
  try {
    await waitForAnalytics();
    
    const path = properties?.path || window.location.pathname;
    
    let pageName = "";
    
    if (path === "/") {
      pageName = "Homepage Viewed";
    } else if (path === "/comecarpt") {
      pageName = "Portuguese Start Page Viewed";
    } else if (path === "/catalog" || path.startsWith("/catalog/")) {
      pageName = "Catalog Viewed";
    } else if (path === "/dashboard") {
      pageName = "Dashboard Viewed";
    } else if (path === "/projects") {
      pageName = "Projects List Viewed";
    } else if (path.startsWith("/projects/")) {
      pageName = "Project Details Viewed";
    } else if (path === "/profile") {
      pageName = "Profile Viewed";
    } else if (path === "/sample-orders") {
      pageName = "Sample Orders Viewed";
    } else if (path === "/profit-calculator") {
      pageName = "Profit Calculator Viewed";
    } else if (path === "/start-here") {
      pageName = "Start Here Viewed";
    } else if (path === "/login") {
      pageName = "Login Page Viewed";
    } else if (path === "/signup") {
      pageName = "Signup Page Viewed";
    } else {
      pageName = `${path.substring(1).replace(/\//g, " ").replace(/-/g, " ")} Viewed`.trim();
    }
    
    if (!pageName) return;
    
    const pageProperties = {
      url: formatUrl(window.location.href),
      path: path,
      referrer: document.referrer,
      title: document.title,
      search: window.location.search,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app',
      ...properties,
      ...(properties?.url ? { url: formatUrl(properties.url) } : {})
    };

    console.log('[Analytics] Tracking page view:', pageName, pageProperties);
    window.analytics.page(pageName, pageProperties);
  } catch (error) {
    console.error('[Analytics] Error tracking page view:', error);
    toast.error('Analytics Error: Failed to track page view');
  }
};

// Initialize analytics as soon as possible
if (typeof window !== 'undefined') {
  initializeAnalytics();
}