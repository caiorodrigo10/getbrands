import { CartItem } from "@/types/cart";

export const trackAddToCart = (item: CartItem) => {
  console.log('Analytics ecommerce - Add to Cart:', item);
};

export const trackCheckoutStep = (step: number, items: CartItem[]) => {
  console.log('Analytics ecommerce - Checkout Step:', { step, items });
};

export const trackCheckoutCompleted = (
  orderId: string,
  items: CartItem[],
  shippingInfo: any,
  total: number,
  shippingCost: number,
  customerEmail: string
) => {
  console.log('Analytics ecommerce - Checkout Completed:', {
    orderId,
    items,
    shippingInfo,
    total,
    shippingCost,
    customerEmail
  });
};