export const isDevelopment = import.meta.env.DEV;
export const SEGMENT_DEBUG = import.meta.env.VITE_SEGMENT_DEBUG === 'true';
export const SEGMENT_WRITE_KEY = import.meta.env.VITE_SEGMENT_WRITE_KEY;

export const shouldTrackEvent = () => {
  return !isDevelopment || import.meta.env.VITE_FORCE_ANALYTICS === 'true';
};

export const debugLog = (type: string, eventName: string, properties?: Record<string, any>) => {
  if (SEGMENT_DEBUG || isDevelopment) {
    console.log(`[Segment ${type}]`, eventName, properties);
  }
};