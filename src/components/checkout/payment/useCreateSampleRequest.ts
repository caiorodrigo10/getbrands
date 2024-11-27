import { supabase } from "@/integrations/supabase/client";
import { validateShippingInfo } from "./usePaymentValidation";
import type { CartItem } from "@/types/cart";

interface CreateSampleRequestParams {
  userId: string;
  items: CartItem[];
  shippingCost: number;
  subtotal: number;
  total: number;
}

export const useCreateSampleRequest = () => {
  const createRequest = async ({ userId, items, shippingCost, subtotal, total }: CreateSampleRequestParams) => {
    const shippingAddress = localStorage.getItem('shipping_address') || '';
    const shippingCity = localStorage.getItem('shipping_city') || '';
    const shippingState = localStorage.getItem('shipping_state') || '';
    const shippingZip = localStorage.getItem('shipping_zip') || '';
    const firstName = localStorage.getItem('firstName') || '';
    const lastName = localStorage.getItem('lastName') || '';
    const phone = localStorage.getItem('phone') || '';
    const useSameForBilling = localStorage.getItem('useSameForBilling') === 'true';

    const billingAddress = useSameForBilling 
      ? shippingAddress 
      : localStorage.getItem('billing_address') || '';
    const billingCity = useSameForBilling 
      ? shippingCity 
      : localStorage.getItem('billing_city') || '';
    const billingState = useSameForBilling 
      ? shippingState 
      : localStorage.getItem('billing_state') || '';
    const billingZip = useSameForBilling 
      ? shippingZip 
      : localStorage.getItem('billing_zip') || '';

    // Validate shipping and billing information
    validateShippingInfo(shippingZip, billingZip, useSameForBilling);

    const { data: sampleRequest, error: sampleRequestError } = await supabase
      .from('sample_requests')
      .insert({
        user_id: userId,
        status: 'pending',
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_zip: shippingZip,
        billing_address: billingAddress,
        billing_city: billingCity,
        billing_state: billingState,
        billing_zip: billingZip,
        first_name: firstName,
        last_name: lastName,
        payment_method: 'credit_card',
        shipping_cost: shippingCost,
        subtotal: subtotal,
        total: total
      })
      .select()
      .single();

    if (sampleRequestError) throw sampleRequestError;

    const sampleRequestProducts = items.map(item => ({
      sample_request_id: sampleRequest.id,
      product_id: item.id,
      quantity: item.quantity || 1,
      unit_price: item.from_price
    }));

    const { error: productsError } = await supabase
      .from('sample_request_products')
      .insert(sampleRequestProducts);

    if (productsError) throw productsError;

    return sampleRequest.id;
  };

  return { createRequest };
};