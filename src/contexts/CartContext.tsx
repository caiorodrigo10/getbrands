
import { createContext, useContext, useEffect, ReactNode, useState } from "react";
import { CartOperations } from "@/types/cart";
import { useAuth } from "./AuthContext";
import { useCartOperations } from "@/hooks/useCartOperations";

const CartContext = createContext<CartOperations | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [lastRefresh, setLastRefresh] = useState<number>(0);
  const {
    items,
    isLoading,
    loadCartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  } = useCartOperations(user);

  // Load cart items when user changes or on manual refresh
  useEffect(() => {
    if (user?.id) {
      console.log("CartContext: Loading cart items for user", user.id);
      loadCartItems();
    } else {
      console.log("CartContext: No user logged in, clearing cart if needed");
      items.length > 0 && clearCart(true);
    }
  }, [user?.id, lastRefresh]); 

  // Enhanced loadCartItems function that also updates lastRefresh
  const refreshCart = async () => {
    console.log("CartContext: Manually refreshing cart");
    setLastRefresh(Date.now());
    if (user?.id) {
      return loadCartItems();
    }
  };

  return (
    <CartContext.Provider
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        isLoading,
        loadCartItems: refreshCart 
      }}
    >
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
