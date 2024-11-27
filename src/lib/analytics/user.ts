// Empty implementations to maintain API compatibility
export const trackSignUp = (userId: string, properties?: Record<string, any>) => {};
export const trackUserLogin = (userId: string, properties?: Record<string, any>) => {};
export const trackSubscriptionStarted = (userId: string, plan: string) => {};
export const trackSubscriptionCancelled = (userId: string, reason?: string) => {};