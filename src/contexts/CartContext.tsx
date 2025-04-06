
import { createContext, useContext, useEffect, ReactNode } from "react";
import { CartOperations } from "@/types/cart";
import { useAuth } from "./AuthContext";
import { useCartOperations } from "@/hooks/useCartOperations";

const CartContext = createContext<CartOperations | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const {
    items,
    isLoading,
    loadCartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartOperations(user);

  // Debug: Check if CartProvider is mounted and accessible
  console.log("CartProvider: Mounted with user:", user?.id);

  // Load cart items when the user changes or on mount
  useEffect(() => {
    if (user?.id) {
      console.log("CartContext - Loading cart items for user:", user.id);
      loadCartItems();
    } else {
      console.log("CartContext - No user, clearing cart");
      items.length > 0 && clearCart(true);
    }
  }, [user?.id]);

  // Provide all cart operations to consumers
  const cartOperations: CartOperations = {
    items, 
    addItem, 
    removeItem, 
    updateQuantity, 
    clearCart, 
    isLoading,
    loadCartItems 
  };

  console.log("CartProvider: Providing cart operations:", 
    Object.keys(cartOperations).map(key => `${key}: ${typeof cartOperations[key as keyof CartOperations]}`));

  return (
    <CartContext.Provider value={cartOperations}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    console.error("useCart called outside of CartProvider");
    throw new Error("useCart must be used within a CartProvider");
  }
  
  console.log("useCart: Successfully connected to cart context with", 
    context.items.length, "items");
  
  return context;
}
