export interface AnalyticsBrowserAPI {
  load(writeKey: string, options?: object): void;
  identify(userId: string, traits?: object): void;
  track(event: string, properties?: object): void;
  page(name?: string, properties?: object): void;
  group(groupId: string, traits?: object): void;
  alias(userId: string, previousId?: string): void;
  debug(): void;
  _writeKey?: string;
}

declare global {
  interface Window {
    analytics: AnalyticsBrowserAPI;
  }
}