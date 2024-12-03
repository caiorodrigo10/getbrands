import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { User } from "@supabase/supabase-js";
import { trackAddToCart } from "@/lib/analytics/ecommerce";

export const useCartOperations = (user: User | null) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCartItems = async () => {
    if (!user?.id) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          *,
          products (*)
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Error loading cart items:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load cart items. Please try again.",
        });
        return;
      }

      const formattedItems = cartItems?.map((item) => ({
        ...item.products,
        quantity: 1
      })) || [];

      setItems(formattedItems);
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

  const addItem = async (product: Product) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to add items to cart.",
      });
      throw new Error("User not authenticated");
    }

    try {
      setIsLoading(true);
      
      // Check if item already exists in cart
      const { data: existingItems, error: queryError } = await supabase
        .from('cart_items')
        .select('id')
        .eq('user_id', user.id)
        .eq('product_id', product.id);

      if (queryError) throw queryError;

      // If item exists, don't add it again
      if (existingItems && existingItems.length > 0) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "This item is already in your cart.",
        });
        return;
      }

      // If item doesn't exist, add it
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id
        });

      if (error) throw error;

      const cartItem = { ...product, quantity: 1 };
      setItems((currentItems) => [...currentItems, cartItem]);
      
      // Track the add to cart event
      trackAddToCart(cartItem);

    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const removeItem = async (id: string) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;

      // Update local state immediately after successful removal
      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      
      // Show success toast
      toast({
        title: "Item removed",
        description: "The item has been removed from your cart.",
      });
      
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async (silent = false) => {
    if (!user?.id) return;

    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      
      if (!silent) {
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart.",
        });
      }
    } catch (error) {
      console.error('Error clearing cart:', error);
      if (!silent) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to clear cart.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return {
    items,
    isLoading,
    loadCartItems,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
  };
};