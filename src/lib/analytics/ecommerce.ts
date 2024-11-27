import { trackEvent } from './core';
import type { EcommerceProperties } from './types';

export const trackAddToCart = (product: any) => {
  trackEvent('Product Added to Cart', {
    product_id: product.id,
    product_name: product.name,
    price: product.from_price,
    quantity: product.quantity
  });
};

export const trackCartEngagement = (properties: EcommerceProperties) => {
  trackEvent('Cart Engagement', properties);
};

export const trackAbandonedCart = (properties: EcommerceProperties) => {
  trackEvent('Abandoned Cart', properties);
};

export const trackCheckoutStep = (step: number, items: any[], additionalProps = {}) => {
  trackEvent('Checkout Step Viewed', {
    step,
    items,
    ...additionalProps
  });
};

export const trackCheckoutCompleted = (
  orderId: string,
  items: any[],
  shippingDetails: any,
  total: number,
  shippingCost: number,
  userEmail: string
) => {
  trackEvent('Order Completed', {
    order_id: orderId,
    items,
    shipping_details: shippingDetails,
    total,
    shipping_cost: shippingCost,
    user_email: userEmail
  });
};