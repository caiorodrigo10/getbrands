import { CartEvent } from "@/types/analytics/events";
import { waitForAnalytics } from "../index";

export const trackCartView = async (data: CartEvent) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Cart Viewed', {
      ...data,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking cart view:', error);
    }
  }
};

export const trackAddToCart = async (item: any) => {
  try {
    await waitForAnalytics();
    window.analytics.track('Product Added to Cart', {
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity || 1,
      price: item.from_price,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      source: 'web_app'
    });
  } catch (error) {
    if (process.env.NODE_ENV !== 'production') {
      console.error('Error tracking add to cart:', error);
    }
  }
};