import { waitForAnalytics } from "../index";
import { AuthEvent, OnboardingEvent, PageEvent } from "@/types/analytics/events";

// Auth Events
export const trackSignUp = async (data: AuthEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('user_signed_up', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking signup:', error);
    }
  }
};

// Onboarding Events
export const trackOnboardingStart = async (data: OnboardingEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('onboarding_started', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking onboarding start:', error);
    }
  }
};

export const trackOnboardingComplete = async (data: OnboardingEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('onboarding_completed', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking onboarding completion:', error);
    }
  }
};

// Page Events
export const trackPageView = async (data: PageEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.page(data.title || "Page Viewed", {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking page view:', error);
    }
  }
};