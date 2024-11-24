import { CartItem } from "@/types/cart";
import { trackEvent } from "./core";

export const trackAddToCart = (product: CartItem) => {
  trackEvent("Product Added to Cart", {
    product_id: product.id,
    product_name: product.name,
    product_category: product.category,
    price: product.from_price,
    quantity: product.quantity,
    revenue: product.from_price * product.quantity,
    currency: "USD"
  });
};

export const trackCheckoutStep = (
  step: number,
  items: CartItem[],
  additionalData?: Record<string, any>
) => {
  const total = items.reduce((sum, item) => sum + (item.from_price * item.quantity), 0);
  
  trackEvent("Checkout Step Viewed", {
    step_number: step,
    step_name: getStepName(step),
    products: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      category: item.category,
      price: item.from_price,
      quantity: item.quantity,
    })),
    total_items: items.length,
    total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    revenue: total,
    currency: "USD",
    ...additionalData
  });
};

export const trackCheckoutCompleted = (
  orderId: string,
  items: CartItem[],
  shippingAddress: any,
  total: number,
  shippingCost: number
) => {
  trackEvent("Order Completed", {
    order_id: orderId,
    products: items.map(item => ({
      product_id: item.id,
      product_name: item.name,
      category: item.category,
      price: item.from_price,
      quantity: item.quantity,
      revenue: item.from_price * item.quantity
    })),
    total_items: items.length,
    total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    revenue: total,
    shipping_cost: shippingCost,
    currency: "USD",
    shipping_address: {
      address: shippingAddress.address1,
      address2: shippingAddress.address2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.zipCode,
      country: "USA"
    },
    customer: {
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      phone: shippingAddress.phone
    }
  });
};

const getStepName = (step: number): string => {
  switch (step) {
    case 1:
      return "Cart Review";
    case 2:
      return "Shipping Information";
    case 3:
      return "Payment";
    default:
      return "Unknown";
  }
};