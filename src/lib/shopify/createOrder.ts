import { supabase } from "@/integrations/supabase/client";

interface CreateOrderParams {
  orderId: string;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    phone?: string;
  };
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    province: string;
    zip: string;
    phone: string;
  };
  lineItems: Array<{
    variant_id: string;
    quantity: number;
    price: number;
  }>;
}

export async function createShopifyOrder({
  orderId,
  customer,
  shippingAddress,
  lineItems
}: CreateOrderParams) {
  console.log('Creating Shopify order:', {
    orderId,
    customerEmail: customer.email,
    itemCount: lineItems.length
  });

  try {
    const { data, error } = await supabase.functions.invoke('shopify-create-order', {
      body: {
        orderData: {
          orderId,
          customer,
          shipping_address: {
            ...shippingAddress,
            first_name: customer.first_name,
            last_name: customer.last_name,
            country: "US"
          },
          billing_address: {
            ...shippingAddress,
            first_name: customer.first_name,
            last_name: customer.last_name,
            country: "US"
          },
          line_items: lineItems,
          financial_status: "paid",
        }
      }
    });

    if (error) {
      console.error('Error creating Shopify order:', error);
      throw error;
    }

    console.log('Shopify order created successfully:', {
      orderId: data?.shopifyOrder?.id,
      orderNumber: data?.shopifyOrder?.order_number
    });

    return data?.shopifyOrder;
  } catch (error) {
    console.error('Failed to create Shopify order:', error);
    throw error;
  }
}