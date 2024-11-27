import { CartItem } from "@/types/cart";

export const trackAddToCart = (item: CartItem) => {
  trackEvent("Product Added to Cart", {
    product_id: item.id,
    product_name: item.name,
    category: item.category,
    price: item.from_price,
    quantity: item.quantity
  });
};

export const trackCheckoutStep = (step: number, items: CartItem[]) => {
  trackEvent("Checkout Step Viewed", {
    step_number: step,
    items: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.from_price
    }))
  });
};

export const trackCheckoutCompleted = (
  orderId: string,
  items: CartItem[],
  shippingInfo: any,
  total: number,
  shippingCost: number,
  customerEmail: string
) => {
  trackEvent("Order Completed", {
    order_id: orderId,
    total_amount: total,
    shipping_cost: shippingCost,
    customer_email: customerEmail,
    shipping_address: shippingInfo,
    products: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.from_price
    }))
  });
};