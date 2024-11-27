import { trackEvent } from './core';
import type { EcommerceProperties } from './types';

export const trackAddToWishlist = (properties: EcommerceProperties) => {
  trackEvent('Product Added to Wishlist', properties);
};

export const trackCartEngagement = (properties: EcommerceProperties) => {
  trackEvent('Cart Engagement', properties);
};

export const trackAbandonedCart = (properties: EcommerceProperties) => {
  trackEvent('Abandoned Cart', properties);
};