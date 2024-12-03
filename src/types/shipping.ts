export interface CreateSampleRequestParams {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  firstName: string;
  lastName: string;
  paymentMethod: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  discountAmount?: number; // Added this optional field
}

export interface CreateOrderParams {
  userId: string;
  products: {
    productId: string;
    quantity: number;
    unitPrice: number;
  }[];
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  billingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
  };
  firstName: string;
  lastName: string;
  paymentMethod: string;
  shippingCost: number;
  subtotal: number;
  total: number;
  discountAmount?: number; // Added this optional field
}