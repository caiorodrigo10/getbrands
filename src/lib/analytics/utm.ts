
import { trackEvent } from './index';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  utm_creative?: string;
  utm_placement?: string;
  utm_device?: string;
  utm_campaignid?: string;
  utm_adsetid?: string;
  utm_adid?: string;
}

export interface FirstTouchUtmParams extends UtmParams {
  first_utm_source?: string;
  first_utm_medium?: string;
  first_utm_campaign?: string;
  first_utm_content?: string;
  first_utm_term?: string;
  first_utm_creative?: string;
  first_utm_placement?: string;
  first_utm_device?: string;
  first_utm_campaignid?: string;
  first_utm_adsetid?: string;
  first_utm_adid?: string;
  language?: string; // Add language tracking
}

const STORAGE_KEY = 'first_touch_utms';

export const extractUtmParams = (url: string): UtmParams => {
  try {
    const searchParams = new URLSearchParams(new URL(url).search);
    const params: UtmParams = {
      utm_source: searchParams.get('utm_source') || undefined,
      utm_medium: searchParams.get('utm_medium') || undefined,
      utm_campaign: searchParams.get('utm_campaign') || undefined,
      utm_content: searchParams.get('utm_content') || undefined,
      utm_term: searchParams.get('utm_term') || undefined,
      utm_creative: searchParams.get('utm_creative') || undefined,
      utm_placement: searchParams.get('utm_placement') || undefined,
      utm_device: searchParams.get('utm_device') || undefined,
      utm_campaignid: searchParams.get('utm_campaignid') || undefined,
      utm_adsetid: searchParams.get('utm_adsetid') || undefined,
      utm_adid: searchParams.get('utm_adid') || undefined,
    };
    
    // Filter out undefined values
    return Object.fromEntries(
      Object.entries(params).filter(([_, value]) => value !== undefined)
    ) as UtmParams;
  } catch (error) {
    console.error("Error extracting UTM parameters:", error);
    return {};
  }
};

export const getLanguageFromUrl = (url: string): string | undefined => {
  try {
    const pathname = new URL(url).pathname;
    if (pathname.startsWith('/pt/') || pathname === '/pt' || pathname === '/comecarpt') {
      return 'pt';
    }
    return 'en';
  } catch (error) {
    return undefined;
  }
};

export const storeFirstTouchUtms = (utmParams: UtmParams) => {
  // Só armazena se não existirem first-touch UTMs
  if (!localStorage.getItem(STORAGE_KEY)) {
    const language = getLanguageFromUrl(window.location.href);
    
    const firstTouchUtms: FirstTouchUtmParams = Object.entries(utmParams).reduce((acc, [key, value]) => {
      if (value) {
        acc[`first_${key}` as keyof FirstTouchUtmParams] = value;
      }
      return acc;
    }, { language } as FirstTouchUtmParams);
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(firstTouchUtms));
  }
};

export const getFirstTouchUtms = (): FirstTouchUtmParams => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getUtmData = (): FirstTouchUtmParams => {
  const currentUrl = window.location.href;
  const currentUtms = extractUtmParams(currentUrl);
  const firstTouchUtms = getFirstTouchUtms();
  const language = getLanguageFromUrl(currentUrl) || firstTouchUtms.language;

  // Armazena first-touch UTMs se necessário
  storeFirstTouchUtms(currentUtms);

  return {
    ...currentUtms,
    ...firstTouchUtms,
    language
  };
};
