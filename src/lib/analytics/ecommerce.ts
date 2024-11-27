import { CartItem } from "@/types/cart";
import { trackEvent } from "./core";
import type { OrderData } from "./types";

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
  const subtotal = items.reduce((sum, item) => sum + (item.from_price * item.quantity), 0);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const shippingCost = 4.50 + Math.max(0, totalItems - 1) * 2;
  const total = subtotal + shippingCost;
  
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
    total_quantity: totalItems,
    subtotal: subtotal,
    shipping_cost: shippingCost,
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
  shippingCost: number,
  customerEmail?: string
) => {
  // Calculate the correct revenue from items
  const subtotal = items.reduce((sum, item) => sum + (item.from_price * item.quantity), 0);
  const totalRevenue = subtotal + shippingCost;

  const orderData: OrderData = {
    order_id: orderId,
    revenue: totalRevenue, // Use the correct total including shipping
    currency: "USD",
    payment_method: "credit_card",
    products: items.map(item => ({
      product_id: item.id,
      sku: item.id,
      name: item.name,
      price: item.from_price,
      quantity: item.quantity,
      category: item.category,
      revenue: item.from_price * item.quantity // Add individual product revenue
    })),
    customer: {
      email: customerEmail,
      first_name: shippingAddress.firstName,
      last_name: shippingAddress.lastName,
      phone: shippingAddress.phone,
    }
  };

  trackEvent("Order Completed", {
    ...orderData,
    total_items: items.length,
    total_quantity: items.reduce((sum, item) => sum + item.quantity, 0),
    shipping_cost: shippingCost,
    subtotal: subtotal,
    shipping_address: {
      address: shippingAddress.address1,
      address2: shippingAddress.address2,
      city: shippingAddress.city,
      state: shippingAddress.state,
      zip: shippingAddress.zipCode,
      country: "USA"
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