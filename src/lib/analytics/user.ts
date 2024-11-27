import { trackEvent } from "./core";

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