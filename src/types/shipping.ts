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
  savedAddressId?: string;
}

export interface Address {
  id: string;
  user_id: string;
  name: string;
  street_address1: string;
  street_address2?: string;
  city: string;
  state: string;
  zip_code: string;
  is_default: boolean;
  type: 'shipping' | 'billing' | 'both';
  created_at: string;
  updated_at: string;
}