import { Product } from "./product";

export interface CartItem extends Product {
  quantity: number;
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