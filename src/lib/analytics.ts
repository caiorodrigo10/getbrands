// Type declaration for analytics from Segment
declare global {
  interface Window {
    analytics: {
      track: (event: string, properties?: Record<string, any>) => void;
      page: (properties?: Record<string, any>) => void;
      identify: (userId: string, traits?: Record<string, any>) => void;
    };
  }
}

// Track page views with additional metadata
export const trackPage = (properties?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.page({
        url: window.location.href,
        path: window.location.pathname,
        ...properties,
        timestamp: new Date().toISOString(),
      });
    }
  } catch (error) {
    console.error('Error tracking page view:', error);
  }
};

// Track specific events
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

// Identify users
export const identifyUser = (userId: string, traits?: Record<string, any>) => {
  try {
    if (window.analytics) {
      window.analytics.identify(userId, traits);
    }
  } catch (error) {
    console.error('Error identifying user:', error);
  }
};

// Navigation Events
export const trackPageSkipped = (fromPage: string, toPage: string) => {
  trackEvent("Page Skipped", { from_page: fromPage, to_page: toPage });
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

// Conversion Events
export const trackSignUp = (method: string, userType: string) => {
  trackEvent("User Signed Up", {
    signup_method: method,
    user_type: userType,
  });
};

export const trackPurchaseCompleted = (orderId: string, amount: number, items: any[]) => {
  trackEvent("Purchase Completed", {
    order_id: orderId,
    total_amount: amount,
    items: items,
  });
};

// Retention Events
export const trackUserLogin = (method: string, userId: string) => {
  trackEvent("User Logged In", {
    login_method: method,
    user_id: userId,
  });
};

export const trackSubscriptionRenewed = (subscriptionId: string, plan: string) => {
  trackEvent("Subscription Renewed", {
    subscription_id: subscriptionId,
    plan: plan,
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

export const trackFeatureRequest = (featureName: string, description: string) => {
  trackEvent("Feature Requested", {
    feature_name: featureName,
    description: description,
  });
};

// Custom Events
export const trackFeatureUsed = (featureName: string, details: Record<string, any>) => {
  trackEvent("Feature Used", {
    feature_name: featureName,
    ...details,
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

export const trackOnboardingAbandoned = (
  lastCompletedStep: number,
  reason?: string
) => {
  trackEvent("Onboarding Abandoned", {
    last_completed_step: lastCompletedStep,
    reason: reason,
  });
};