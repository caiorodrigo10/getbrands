import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";

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
          financial_status: "paid"
        }
      }
    });

    if (error) throw error;

    toast({
      title: "Order created in Shopify",
      description: `Order #${data.shopifyOrder.order_number} was created successfully.`
    });

    return data.shopifyOrder;

  } catch (error) {
    console.error('Error creating Shopify order:', error);
    toast({
      variant: "destructive",
      title: "Error creating order",
      description: "There was a problem creating your order in Shopify. Please try again."
    });
    throw error;
  }
}