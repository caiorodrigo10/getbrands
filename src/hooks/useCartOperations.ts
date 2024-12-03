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
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user.id);

      if (cartError) throw cartError;

      if (cartItems) {
        const formattedItems = cartItems.map(item => ({
          ...item.products,
          quantity: 1
        })) as CartItem[];

        setItems(formattedItems);
      }
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load cart items. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Product) => {
    if (!user?.id) return;

    try {
      // First check if the item already exists in the database
      const { data: existingCartItem, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', item.id)
        .maybeSingle();

      if (checkError) throw checkError;

      if (existingCartItem) {
        // If item exists in database, update local state
        const existingItem = items.find(i => i.id === item.id);
        if (existingItem) {
          await updateQuantity(item.id, (existingItem.quantity || 1) + 1);
        } else {
          // If item exists in database but not in state, add it to state
          setItems(prev => [...prev, { ...item, quantity: 1 }]);
        }
        return;
      }

      // If item doesn't exist, insert new cart item
      const { error: insertError } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.id
        });

      if (insertError) {
        // If error is not duplicate key error, throw it
        if (insertError.code !== '23505') {
          throw insertError;
        }
      }

      setItems(prev => [...prev, { ...item, quantity: 1 }]);
      
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to add item to cart",
      });
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
      
    } catch (error: any) {
      console.error('Error removing item from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to remove item from cart",
      });
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
    } catch (error: any) {
      console.error('Error clearing cart:', error);
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Error",
          description: error.message || "Failed to clear cart",
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