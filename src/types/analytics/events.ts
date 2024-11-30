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

// Eventos de Página
export interface PageEvent extends BaseEvent {
  url: string;
  path: string;
  title?: string;
  referrer?: string;
  search?: string;
}

// Eventos de Marketing
export interface MarketingEvent extends BaseEvent {
  quizId?: string;
  language: string;
  answers?: Record<string, any>;
  source?: string;
  referrer?: string;
}
