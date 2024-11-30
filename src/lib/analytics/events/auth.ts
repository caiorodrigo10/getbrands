import { AuthEvent } from "@/types/analytics/events";
import { waitForAnalytics } from "../index";

export const trackSignIn = async (data: AuthEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('user_signed_in', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking signin:', error);
    }
  }
};

export const trackSignOut = async (userId: string) => {
  try {
    await waitForAnalytics();
    window.analytics.track('user_signed_out', {
      userId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking signout:', error);
    }
  }
};

export const trackPasswordReset = async (userId: string) => {
  try {
    await waitForAnalytics();
    window.analytics.track('password_reset_requested', {
      userId,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking password reset:', error);
    }
  }
};