import { supabase } from "@/integrations/supabase/client";
import { formatPhoneForShopify } from "./phoneFormatter";
import { createShopifyOrder } from "@/lib/shopify/createOrder";
import { trackOrderCompleted } from "@/lib/analytics/events";
import type { CartItem } from "@/types/cart";

interface CreateOrderParams {
  user: {
    id: string;
    email: string;
  };
  items: CartItem[];
  total: number;
  shippingCost: number;
  orderId: string;
}

export const createOrder = async ({ user, items, total, shippingCost, orderId }: CreateOrderParams) => {
  // Get Shopify variant IDs for the products
  const { data: shopifyProducts, error: shopifyError } = await supabase
    .from('shopify_products')
    .select('shopify_variant_id, product_id')
    .in('product_id', items.map(item => item.id));

  if (shopifyError) throw shopifyError;

  // Create a map of our product IDs to Shopify variant IDs
  const variantMap = new Map(
    shopifyProducts?.map(sp => [sp.product_id, sp.shopify_variant_id]) || []
  );

  const phone = localStorage.getItem('phone') || '';
  const formattedPhone = formatPhoneForShopify(phone);
  
  if (!formattedPhone) {
    throw new Error('Invalid phone number format');
  }

  // Create order in Shopify
  await createShopifyOrder({
    orderId,
    customer: {
      first_name: localStorage.getItem('firstName') || '',
      last_name: localStorage.getItem('lastName') || '',
      email: user.email,
      phone: formattedPhone,
    },
    shippingAddress: {
      address1: localStorage.getItem('shipping_address') || '',
      address2: localStorage.getItem('shipping_address2') || undefined,
      city: localStorage.getItem('shipping_city') || '',
      province: localStorage.getItem('shipping_state') || '',
      zip: localStorage.getItem('shipping_zip') || '',
      phone: formattedPhone,
    },
    lineItems: items.map(item => ({
      variant_id: variantMap.get(item.id) || '',
      quantity: item.quantity || 1,
      price: item.from_price
    }))
  });

  // Track successful checkout
  trackOrderCompleted(
    orderId,
    items,
    {
      firstName: localStorage.getItem('firstName'),
      lastName: localStorage.getItem('lastName'),
      phone: formattedPhone,
      address1: localStorage.getItem('shipping_address'),
      city: localStorage.getItem('shipping_city'),
      state: localStorage.getItem('shipping_state'),
      zipCode: localStorage.getItem('shipping_zip'),
    },
    total,
    shippingCost,
    user.email
  );
};
