import { PageViewProperties, ErrorProperties } from './types';

declare global {
  interface Window {
    analytics: any;
  }
}

const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

export const initializeAnalytics = () => {
  if (!window.analytics && isProduction) {
    console.warn('Analytics not initialized');
    return;
  }
};

export const trackPage = (properties: PageViewProperties) => {
  if (!window.analytics) return;
  
  window.analytics.page({
    ...properties,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  if (isDevelopment) {
    console.log('Page View:', properties);
  }
};

export const trackEvent = (eventName: string, properties: Record<string, any> = {}) => {
  if (!window.analytics) return;

  window.analytics.track(eventName, {
    ...properties,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  if (isDevelopment) {
    console.log('Event:', eventName, properties);
  }
};

export const identifyUser = (
  userId: string, 
  traits: Record<string, any> = {}
) => {
  if (!window.analytics) return;

  window.analytics.identify(userId, {
    ...traits,
    environment: process.env.NODE_ENV,
    last_identified_at: new Date().toISOString(),
  });

  if (isDevelopment) {
    console.log('Identify User:', userId, traits);
  }
};

export const trackError = (properties: ErrorProperties) => {
  if (!window.analytics) return;

  window.analytics.track('Error Occurred', {
    ...properties,
    environment: process.env.NODE_ENV,
    timestamp: new Date().toISOString(),
  });

  if (isDevelopment) {
    console.error('Error Tracked:', properties);
  }
};