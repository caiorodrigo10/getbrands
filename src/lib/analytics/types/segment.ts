export interface SegmentAnalytics {
  initialize(): void;
  invoked: boolean;
  methods: string[];
  factory(method: string): Function;
  push(...args: any[]): void;
}

export interface SegmentAnalyticsJS extends Array<any> {
  track(event: string, properties?: Record<string, any>): void;
  page(properties?: Record<string, any>): void;
  identify(userId: string, traits?: Record<string, any>): void;
  group(groupId: string, traits?: Record<string, any>): void;
  screen(screenName: string, properties?: Record<string, any>): void;
  initialize(): void;
  invoked: boolean;
  methods: string[];
  factory(method: string): Function;
  push(...args: any[]): void;
}

declare global {
  interface Window {
    analytics: SegmentAnalyticsJS;
  }
}