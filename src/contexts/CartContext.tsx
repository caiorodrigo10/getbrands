import { createContext, useContext, useEffect, ReactNode } from "react";
import { CartOperations } from "@/types/cart";
import { useAuth } from "./AuthContext";
import { useCartOperations } from "@/hooks/useCartOperations";

const CartContext = createContext<CartOperations | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const cartOperations = useCartOperations(user);

  useEffect(() => {
    if (user?.id) {
      cartOperations.loadCartItems();
    } else {
      cartOperations.items.length > 0 && cartOperations.clearCart(true);
    }
  }, [user?.id]); 

  return (
    <CartContext.Provider value={cartOperations}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}