import { AnalyticsBrowserAPI } from "@/types/analytics";

declare global {
  interface Window {
    analytics: AnalyticsBrowserAPI;
  }
}

export const debugAnalytics = () => {
  console.log('Initializing Segment Analytics debugging...');
  
  // Wait for analytics to be available
  const checkAnalytics = () => {
    if (!window.analytics) {
      console.error('❌ Segment analytics not initialized! Retrying in 1s...');
      setTimeout(checkAnalytics, 1000);
      return false;
    }

    console.log('✅ Segment analytics object found');
    console.log(`Write Key: ${window.analytics._writeKey}`);

    // Enable debug mode in all environments
    window.analytics.debug();

    // Test page tracking
    try {
      window.analytics.page("Debug Page", {
        title: document.title,
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        debug: true
      });
      console.log('✅ Page tracking test successful');
    } catch (error) {
      console.error('❌ Page tracking test failed:', error);
    }

    // Test event tracking
    try {
      window.analytics.track("Debug Event", {
        timestamp: new Date().toISOString(),
        debug: true
      });
      console.log('✅ Event tracking test successful');
    } catch (error) {
      console.error('❌ Event tracking test failed:', error);
    }

    return true;
  };

  return checkAnalytics();
};

export const validateSegmentCall = (eventName: string, properties?: Record<string, any>) => {
  if (!window.analytics) {
    console.error(`Failed to track "${eventName}": analytics not initialized`);
    return false;
  }

  try {
    window.analytics.track(eventName, {
      ...properties,
      validated: true,
      timestamp: new Date().toISOString()
    });
    return true;
  } catch (error) {
    console.error(`Failed to track "${eventName}":`, error);
    return false;
  }
};