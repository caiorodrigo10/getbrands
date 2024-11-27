// Placeholder analytics functions until we reimplement Segment
export const identifyUser = async (userId: string, traits?: Record<string, any>) => {
  console.log('Analytics identify:', { userId, traits });
};

export const trackEvent = (eventName: string, properties?: Record<string, any>) => {
  console.log('Analytics track:', { eventName, properties });
};

export const trackPage = (properties?: Record<string, any>) => {
  console.log('Analytics page:', { properties });
};