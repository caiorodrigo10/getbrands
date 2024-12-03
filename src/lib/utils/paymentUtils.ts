import { supabase } from "@/integrations/supabase/client";
import { formatPhoneForShopify } from "./phoneFormatter";
import { createShopifyOrder } from "@/lib/shopify/createOrder";
import { trackCheckoutCompleted } from "@/lib/analytics/ecommerce";
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
  console.log('Creating order with params:', { 
    userId: user.id,
    itemCount: items.length,
    total,
    shippingCost,
    orderId 
  });

  // Get Shopify variant IDs for the products
  const { data: shopifyProducts, error: shopifyError } = await supabase
    .from('shopify_products')
    .select('shopify_variant_id, product_id')
    .in('product_id', items.map(item => item.id));

  if (shopifyError) {
    console.error('Error fetching Shopify products:', shopifyError);
    throw new Error('Failed to fetch Shopify product mappings');
  }

  if (!shopifyProducts || shopifyProducts.length === 0) {
    console.error('No Shopify products found for:', items.map(item => item.id));
    throw new Error('Products are not properly configured in Shopify. Please contact support.');
  }

  // Create a map of our product IDs to Shopify variant IDs
  const variantMap = new Map(
    shopifyProducts?.map(sp => [sp.product_id, sp.shopify_variant_id]) || []
  );

  // Validate that all products have Shopify variants
  const productsWithoutVariants = items.filter(item => !variantMap.get(item.id));
  if (productsWithoutVariants.length > 0) {
    console.error('Products missing Shopify variants:', productsWithoutVariants);
    throw new Error(`Some products are not properly configured in Shopify (${productsWithoutVariants.length} items). Please contact support.`);
  }

  const phone = localStorage.getItem('phone') || '';
  const formattedPhone = formatPhoneForShopify(phone);
  
  if (!formattedPhone) {
    throw new Error('Invalid phone number format');
  }

  // Create order in Shopify
  const shopifyOrder = await createShopifyOrder({
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
    })).filter(item => item.variant_id) // Only include items with valid variant IDs
  });

  console.log('Shopify order created:', shopifyOrder);

  // Update sample request with Shopify order ID
  if (shopifyOrder?.id) {
    const { error: updateError } = await supabase
      .from('sample_requests')
      .update({ shopify_order_id: shopifyOrder.id.toString() })
      .eq('id', orderId);

    if (updateError) {
      console.error('Error updating sample request with Shopify order ID:', updateError);
    }
  }

  // Track successful checkout
  trackCheckoutCompleted(
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

  return shopifyOrder;
};