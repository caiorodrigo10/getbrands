import { 
  AuthEvent, 
  OnboardingEvent, 
  ProductEvent, 
  CartEvent, 
  PageEvent 
} from "@/types/analytics/events";
import { waitForAnalytics } from "../index";

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

// Product Events
export const trackProductView = async (data: ProductEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Viewed', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking product view:', error);
    }
  }
};

// Cart Events
export const trackCartView = async (data: CartEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Cart Viewed', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking cart view:', error);
    }
  }
};

// Checkout Events
export const trackCheckoutCompleted = async (data: {
  orderId: string;
  total: number;
  shippingCost: number;
  customerEmail: string;
  products: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }>;
}) => {
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
      console.error('Error tracking checkout completion:', error);
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