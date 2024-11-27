// Empty implementations to maintain API compatibility
export const trackPage = (data: any) => {};
export const trackEvent = (name: string, properties?: Record<string, any>) => {};
export const identifyUser = (userId: string, traits?: Record<string, any>) => {};
export const trackError = (name: string, message: string, location?: string) => {};