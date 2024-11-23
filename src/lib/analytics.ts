// Type declaration for analytics from Segment
declare global {
  interface Window {
    analytics: {
      track: (event: string, properties?: Record<string, any>) => void;
      page: (properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
      group: (groupId: string, traits?: Record<string, any>) => void;
      screen: (screenName: string, properties?: Record<string, any>) => void;
    };
  }
}

// Track page views (maps to Mixpanel "Page Calls" preset)
export const trackPage = (properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.page({
        url: window.location.href,
        path: window.location.pathname,
        referrer: document.referrer,
        title: document.title,
        search: window.location.search,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track specific events (maps to Mixpanel "Track Calls" preset)
export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.track(eventName, {
        url: window.location.href,
        path: window.location.pathname,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking event:', error);
  }
};

// Identify users (maps to Mixpanel "Identify Calls" preset)
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.identify(userId, {
        ...traits,
        lastIdentified: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

// Track screen views for mobile/spa (maps to Mixpanel "Screen Calls" preset)
export const trackScreen = (screenName: string, properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.screen(screenName, {
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking screen view:', error);
  }
};

// Group identify for organization/team features (maps to Mixpanel "Group Calls" preset)
export const identifyGroup = (groupId: string, traits?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.group(groupId, {
        ...traits,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error identifying group:', error);
  }
};

// Purchase tracking (maps to Mixpanel "Order Completed Calls" preset)
export const trackPurchase = (orderId: string, amount: number, items: any[]) => {
  try {
    if (window.analytics) {
      window.analytics.track("Order Completed", {
        order_id: orderId,
        revenue: amount,
        currency: 'USD',
        products: items.map(item => ({
          product_id: item.id,
          sku: item.id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          category: item.category
        })),
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking purchase:', error);
  }
};

// Engagement Events
export const trackButtonClick = (buttonId: string, buttonName: string, location: string) => {
  trackEvent("Button Clicked", {
    button_id: buttonId,
    button_name: buttonName,
    location: location,
  });
};

export const trackFormSubmitted = (formName: string, formData: Record<string, any>) => {
  trackEvent("Form Submitted", {
    form_name: formName,
    ...formData,
  });
};

// User Lifecycle Events
export const trackSignUp = (method: string, userType: string) => {
  trackEvent("User Signed Up", {
    signup_method: method,
    user_type: userType,
  });
};

export const trackUserLogin = (method: string, userId: string) => {
  trackEvent("User Logged In", {
    login_method: method,
    user_id: userId,
  });
};

// Onboarding Events
export const trackOnboardingStarted = (userType: string) => {
  trackEvent("Onboarding Started", {
    user_type: userType,
  });
};

export const trackOnboardingStepCompleted = (
  stepNumber: number, 
  stepName: string, 
  stepData: Record<string, any>
) => {
  trackEvent("Onboarding Step Completed", {
    step_number: stepNumber,
    step_name: stepName,
    ...stepData,
  });
};

export const trackOnboardingCompleted = (userData: Record<string, any>) => {
  trackEvent("Onboarding Completed", {
    ...userData,
  });
};

export const trackOnboardingAbandoned = (
  lastCompletedStep: number,
  reason?: string
) => {
  trackEvent("Onboarding Abandoned", {
    last_completed_step: lastCompletedStep,
    reason: reason,
  });
};

// Error Events
export const trackError = (errorType: string, errorMessage: string, location: string) => {
  trackEvent("Error Encountered", {
    error_type: errorType,
    error_message: errorMessage,
    location: location,
  });
};

// Feature Usage Events
export const trackFeatureUsed = (featureName: string, details: Record<string, any>) => {
  trackEvent("Feature Used", {
    feature_name: featureName,
    ...details,
  });
};

// Subscription Events
export const trackSubscriptionStarted = (planName: string, amount: number) => {
  trackEvent("Subscription Started", {
    plan_name: planName,
    amount: amount,
    currency: 'USD',
  });
};

export const trackSubscriptionCancelled = (planName: string, reason?: string) => {
  trackEvent("Subscription Cancelled", {
    plan_name: planName,
    reason: reason,
  });
};