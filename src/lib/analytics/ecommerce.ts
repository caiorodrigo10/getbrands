import { CartItem } from "@/types/cart";
import { trackEvent } from "@/lib/analytics";

export const trackAddToCart = (item: CartItem, source: string) => {
  trackEvent("Product Added to Cart", {
    product_id: item.id,
    product_name: item.name,
    category: item.category,
    price: item.from_price,
    quantity: item.quantity,
    currency: "BRL",
    source_page: source,
    timestamp: new Date().toISOString(),
    variants: item.variants || [],
    total_value: item.from_price * item.quantity
  });
};

export const trackCheckoutStep = (
  step: number, 
  stepName: string,
  items: CartItem[], 
  shippingInfo?: any,
  paymentMethod?: string
) => {
  trackEvent("Checkout Step Viewed", {
    step_number: step,
    step_name: stepName,
    items: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.from_price,
      total: item.from_price * item.quantity
    })),
    total_value: items.reduce((acc, item) => acc + (item.from_price * item.quantity), 0),
    currency: "BRL",
    shipping_address: shippingInfo,
    payment_method: paymentMethod,
    timestamp: new Date().toISOString()
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
    currency: "BRL",
    products: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      quantity: item.quantity,
      price: item.from_price,
      total: item.from_price * item.quantity
    })),
    timestamp: new Date().toISOString()
  });
};