import { AnalyticsBrowserAPI } from "@/types/analytics";

declare global {
  interface Window {
    analytics: AnalyticsBrowserAPI;
  }
}

export const debugAnalytics = () => {
  console.log('🔍 Initializing Segment Analytics debugging...');
  
  return new Promise<boolean>((resolve) => {
    const maxAttempts = 5;
    let attempts = 0;

    const checkAnalytics = () => {
      attempts++;
      if (!window.analytics) {
        console.error(`❌ Segment analytics not initialized! Attempt ${attempts}/${maxAttempts}...`);
        if (attempts < maxAttempts) {
          setTimeout(checkAnalytics, 1000);
          return;
        }
        console.error('❌ Failed to initialize Segment after all attempts');
        resolve(false);
        return;
      }

      console.log('✅ Segment analytics object found');
      console.log(`Write Key: ${window.analytics._writeKey}`);
      console.log('Environment:', process.env.NODE_ENV);

      // Enable debug mode in all environments
      window.analytics.debug();
      console.log('🐛 Debug mode enabled');

      // Test identify call
      try {
        window.analytics.identify("debug_user", {
          email: "debug@test.com",
          debug: true,
          timestamp: new Date().toISOString(),
          source: 'web_app'
        });
        console.log('✅ Identify call test successful');
      } catch (error) {
        console.error('❌ Identify call test failed:', error);
      }

      // Test page tracking
      try {
        window.analytics.page("Debug Page", {
          title: document.title,
          url: window.location.href,
          path: window.location.pathname,
          referrer: document.referrer,
          debug: true,
          source: 'web_app',
          timestamp: new Date().toISOString()
        });
        console.log('✅ Page tracking test successful');
      } catch (error) {
        console.error('❌ Page tracking test failed:', error);
      }

      // Test event tracking
      try {
        window.analytics.track("Debug Event", {
          timestamp: new Date().toISOString(),
          debug: true,
          source: 'web_app',
          environment: process.env.NODE_ENV
        });
        console.log('✅ Event tracking test successful');
      } catch (error) {
        console.error('❌ Event tracking test failed:', error);
      }

      resolve(true);
    };

    checkAnalytics();
  });
};

export const validateSegmentCall = (eventName: string, properties?: Record<string, any>) => {
  if (!window.analytics) {
    console.error(`❌ Failed to track "${eventName}": analytics not initialized`);
    return false;
  }

  try {
    console.log(`🔍 Tracking event: ${eventName}`, {
      ...properties,
      timestamp: new Date().toISOString(),
      debug: true
    });

    window.analytics.track(eventName, {
      ...properties,
      validated: true,
      timestamp: new Date().toISOString(),
      source: 'web_app',
      environment: process.env.NODE_ENV
    });

    console.log(`✅ Successfully tracked "${eventName}"`);
    return true;
  } catch (error) {
    console.error(`❌ Failed to track "${eventName}":`, error);
    return false;
  }
};

export const logAnalyticsError = (error: any, context: string) => {
  console.error(`❌ Analytics Error in ${context}:`, {
    message: error.message,
    stack: error.stack,
    timestamp: new Date().toISOString(),
    context
  });
};