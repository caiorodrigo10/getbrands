export interface ShippingFormData {
  firstName: string;
  lastName: string;
  address1: string;
  address2?: string;
  city: string;
  state: string;
  zipCode: string;
  phone: string;
  useSameForBilling: boolean;
  billingAddress1?: string;
  billingAddress2?: string;
  billingCity?: string;
  billingState?: string;
  billingZipCode?: string;
  savedAddressId?: string;
}

export interface Address {
  id: string;
  user_id: string;
  name?: string;
  street_address1: string;
  street_address2?: string | null;
  city: string;
  state: string;
  zip_code: string;
  type: 'shipping' | 'billing' | 'both' | null;
  created_at: string;
  updated_at: string;
}