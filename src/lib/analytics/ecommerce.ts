// Empty implementations to maintain API compatibility
export const trackAddToCart = (item: any) => {};
export const trackCheckoutStep = (step: number, items: any[], data?: any) => {};
export const trackOrderCompleted = (orderId: string, items: any[]) => {};
export const trackCheckoutCompleted = (
  orderId: string,
  items: any[],
  shippingInfo: any,
  total: number,
  shippingCost: number,
  email: string
) => {};