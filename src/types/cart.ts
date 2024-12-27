import type { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
  price?: number;
}

export interface CartOperations {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: (silent?: boolean) => Promise<void>;
  loadCartItems: () => Promise<void>;
  isLoading: boolean;
}