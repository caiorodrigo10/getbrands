interface AnalyticsBrowserAPI {
  load(writeKey: string, options?: object): void;
  identify(userId: string, traits?: object): void;
  track(event: string, properties?: object): void;
  page(properties?: object): void;
  group(groupId: string, traits?: object): void;
  alias(userId: string, previousId?: string): void;
}

interface Window {
  analytics: AnalyticsBrowserAPI;
}