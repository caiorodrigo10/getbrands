// Type definitions to maintain type compatibility
export type AnalyticsEvent = {
  name: string;
  properties?: Record<string, any>;
};

export type AnalyticsUser = {
  id: string;
  traits?: Record<string, any>;
};

export type AnalyticsPage = {
  name: string;
  properties?: Record<string, any>;
};