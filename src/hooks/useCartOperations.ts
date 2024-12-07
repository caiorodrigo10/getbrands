import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CartItem } from "@/types/cart";
import { Product } from "@/types/product";
import { useAuth } from "@/contexts/AuthContext";

export const useCartOperations = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const addItem = async (product: Product) => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("cart_items")
        .insert({
          user_id: user.id,
          product_id: product.id,
          quantity: 1
        })
        .select()
        .single();

      if (error) throw error;

      const cartItem: CartItem = {
        ...product,
        quantity: 1
      };
      
      setItems([...items, cartItem]);
    } catch (error) {
      console.error("Error adding item to cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("product_id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setItems(items.filter(item => item.id !== id));
    } catch (error) {
      console.error("Error removing item from cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .update({ quantity })
        .eq("product_id", id)
        .eq("user_id", user.id);

      if (error) throw error;

      setItems(
        items.map(item =>
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error("Error updating cart item quantity:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const clearCart = async () => {
    if (!user?.id) return;

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from("cart_items")
        .delete()
        .eq("user_id", user.id);

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error("Error clearing cart:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    isLoading
  };
};