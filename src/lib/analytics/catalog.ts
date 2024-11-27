import { trackEvent } from './core';
import type { CatalogProperties } from './types';

export const trackCatalogSearch = (properties: CatalogProperties) => {
  trackEvent('Catalog Search Performed', properties);
};

export const trackProductComparison = (properties: CatalogProperties) => {
  trackEvent('Product Comparison Viewed', properties);
};