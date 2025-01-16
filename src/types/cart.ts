import { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartOperations {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  loadCartItems: () => Promise<void>;
  isLoading: boolean;
}