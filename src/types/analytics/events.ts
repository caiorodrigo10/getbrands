export interface BaseEvent {
  timestamp?: string;
  environment?: string;
  source?: string;
}

// Eventos de Autenticação
export interface AuthEvent extends BaseEvent {
  userId: string;
  email: string;
  signupMethod?: string;
  language?: string;
  provider?: string;
  success?: boolean;
  error?: string;
}

// Eventos de Onboarding
export interface OnboardingEvent extends BaseEvent {
  userId: string;
  profile_type?: string;
  product_interest?: string[];
  brand_status?: string;
  language?: string;
  source?: string;
}

// Eventos de Produto
export interface ProductEvent extends BaseEvent {
  productId: string;
  productName: string;
  category?: string;
  price?: number;
}

// Eventos de Carrinho
export interface CartEvent extends BaseEvent {
  items: {
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
  }[];
  items_count: number;
}

// Eventos de Checkout
export interface CheckoutEvent extends BaseEvent {
  orderId: string;
  total: number;
  shippingCost: number;
  subtotal: number;
  customerEmail: string;
  customerName?: string;
  paymentMethod: string;
  shippingAddress: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  billingAddress?: {
    address1: string;
    address2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  products: Array<{
    product_id: string;
    product_name: string;
    quantity: number;
    price: number;
    category?: string;
    image_url?: string;
  }>;
}

// Eventos de Marketing
export interface MarketingEvent extends BaseEvent {
  language: string;
  source?: string;
  answers?: Record<string, any>;
  quizId?: string;
}

// Eventos de Página
export interface PageEvent extends BaseEvent {
  url: string;
  path: string;
  title?: string;
  referrer?: string;
  search?: string;
}
