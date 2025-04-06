
import { createContext, useContext, useEffect, ReactNode } from "react";
import { CartOperations } from "@/types/cart";
import { useAuth } from "./AuthContext";
import { useCartOperations } from "@/hooks/useCartOperations";
import { Product } from "@/types/product";

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
  console.log("[CART CONTEXT] CartProvider: Mounted with user:", user?.id);

  // Load cart items when the user changes or on mount
  useEffect(() => {
    if (user?.id) {
      console.log("[CART CONTEXT] Loading cart items for user:", user.id);
      loadCartItems().catch(error => {
        console.error("[CART CONTEXT] Error in useEffect loadCartItems:", error);
        console.error("[CART CONTEXT] Error details:", {
          message: error?.message,
          code: error?.code,
          details: error?.details
        });
      });
    } else {
      console.log("[CART CONTEXT] No user, clearing cart");
      items.length > 0 && clearCart(true);
    }
  }, [user?.id]);

  // Provide all cart operations to consumers
  const cartOperations: CartOperations = {
    items, 
    addItem: async (product: Product) => {
      console.log("[CART CONTEXT] addItem wrapper called with product:", product.id);
      try {
        const result = await addItem(product);
        console.log("[CART CONTEXT] addItem wrapper completed with result:", result);
        return result;
      } catch (error: any) {
        console.error("[CART CONTEXT] Error in addItem wrapper:", error);
        console.error("[CART CONTEXT] Error details:", {
          message: error?.message,
          stack: error?.stack
        });
        return false;
      }
    },
    removeItem, 
    updateQuantity, 
    clearCart, 
    isLoading,
    loadCartItems 
  };

  console.log("[CART CONTEXT] CartProvider: Providing cart operations:", 
    Object.keys(cartOperations).map(key => `${key}: ${typeof cartOperations[key as keyof CartOperations]}`));
  console.log("[CART CONTEXT] Current cart items:", items.length);

  return (
    <CartContext.Provider value={cartOperations}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  
  if (context === undefined) {
    console.error("[CART CONTEXT] useCart called outside of CartProvider");
    throw new Error("useCart must be used within a CartProvider");
  }
  
  console.log("[CART CONTEXT] useCart: Successfully connected to cart context with", 
    context.items.length, "items");
  
  return context;
}
