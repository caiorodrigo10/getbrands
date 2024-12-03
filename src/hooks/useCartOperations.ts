import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CartItem } from "@/types/cart";
import type { User } from "@supabase/supabase-js";

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
          products (
            id,
            name,
            description,
            image_url,
            from_price
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const cartItems = data.map(item => ({
        id: item.product_id,
        ...item.products,
        quantity: 1
      }));

      setItems(cartItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: CartItem) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.id
        });

      if (error) throw error;

      setItems(prev => [...prev, item]);
      toast({
        title: "Item added to cart",
        description: `${item.name} has been added to your cart.`
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
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
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart."
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
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
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to clear cart"
        });
      }
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