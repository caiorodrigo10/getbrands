// Type definitions to maintain type compatibility
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

export type UserTraits = {
  email?: string;
  name?: string;
  [key: string]: any;
};