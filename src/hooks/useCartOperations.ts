import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import type { CartItem } from "@/types/cart";
import type { User } from "@supabase/supabase-js";
import type { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";

export const useCartOperations = (user: User | null) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCartItems = async () => {
    if (!user?.id) return;
    
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('cart_items')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems = data.map(item => ({
        ...item.products,
        quantity: 1
      })) as CartItem[];

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Product) => {
    if (!user?.id) return;

    try {
      // Check if item already exists in cart
      const existingItem = items.find(i => i.id === item.id);
      
      if (existingItem) {
        // If item exists, update quantity instead of inserting
        await updateQuantity(item.id, (existingItem.quantity || 1) + 1);
        return;
      }

      // If item doesn't exist, insert new cart item
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.id
        });

      if (error) {
        // If error is not duplicate key error, throw it
        if (error.code !== '23505') {
          throw error;
        }
      }

      setItems(prev => [...prev, { ...item, quantity: 1 }]);
      
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', itemId);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== itemId));
      
    } catch (error) {
      console.error('Error removing item from cart:', error);
      throw error;
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    // Update local state immediately for better UX
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );

    // No need to update database as we only store the item reference
    // Quantity is managed in the frontend state
  };

  const clearCart = async (silent: boolean = false) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      
      if (!silent) {
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart."
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to clear cart"
        });
      }
      throw error;
    }
  };

  return {
    items,
    isLoading,
    loadCartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart
  };
};