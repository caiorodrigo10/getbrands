import { User } from "@supabase/supabase-js";

declare global {
  interface Window {
    analytics: any;
  }
}

const SEGMENT_WRITE_KEY = import.meta.env.VITE_SEGMENT_WRITE_KEY;

export const initializeAnalytics = () => {
  if (!window.analytics) {
    console.warn('Analytics not initialized');
    return;
  }

  window.analytics.ready(() => {
    console.log('Segment initialized with write key:', SEGMENT_WRITE_KEY);
  });

  // Enable debug mode in development
  if (process.env.NODE_ENV === 'development') {
    window.analytics.debug();
  }
};

export const identifyUser = (user: User, traits: Record<string, any> = {}) => {
  if (!window.analytics) {
    console.warn('Analytics not initialized - cannot identify user');
    return;
  }

  window.analytics.ready(() => {
    window.analytics.identify(user.id, {
      email: user.email,
      ...traits,
      environment: process.env.NODE_ENV,
      last_identified_at: new Date().toISOString(),
    });
    console.log('User identified in Segment:', user.id);
  });
};

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (!window.analytics) {
    console.warn('Analytics not initialized - cannot track event:', eventName);
    return;
  }

  window.analytics.ready(() => {
    window.analytics.track(eventName, {
      ...properties,
      environment: process.env.NODE_ENV,
      timestamp: new Date().toISOString(),
    });
    console.log('Event tracked in Segment:', eventName, properties);
  });
};