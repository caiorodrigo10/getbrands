import { CheckoutEvent } from "@/types/analytics/events";
import { waitForAnalytics } from "../index";

export const trackCheckoutStarted = async (data: Omit<CheckoutEvent, "orderId">) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Checkout Started', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking checkout start:', error);
    }
  }
};

export const trackCheckoutStepViewed = async (
  step: 'cart' | 'shipping' | 'payment',
  data: Partial<CheckoutEvent>
) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Checkout Step Viewed', {
      ...data,
      step,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking checkout step:', error);
    }
  }
};

export const trackCheckoutStepCompleted = async (
  step: 'cart' | 'shipping' | 'payment',
  data: Partial<CheckoutEvent>
) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Checkout Step Completed', {
      ...data,
      step,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking checkout step completion:', error);
    }
  }
};

export const trackOrderCompleted = async (data: CheckoutEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Order Completed', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking order completion:', error);
    }
  }
};