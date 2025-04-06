
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { User } from "@supabase/supabase-js";

export const useCartOperations = (user: User | null) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const loadCartItems = async () => {
    if (!user?.id) {
      console.log("Cart: loadCartItems - No user ID available, skipping fetch");
      return;
    }
    
    console.log(`Cart: loadCartItems - Attempting to fetch cart items for user ${user.id}`);
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
            from_price,
            category,
            srp,
            is_new,
            is_tiktok,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (error) {
        console.error('Cart: loadCartItems - Error fetching cart items:', error);
        throw error;
      }

      console.log(`Cart: loadCartItems - Successfully fetched ${data?.length} cart items:`, data);

      const cartItems: CartItem[] = data.map(item => ({
        id: item.product_id,
        ...item.products,
        quantity: 1
      }));

      setItems(cartItems);
      console.log("Cart: loadCartItems - Processed cart items:", cartItems);
    } catch (error) {
      console.error('Cart: loadCartItems - Error loading cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Product) => {
    if (!user?.id) {
      console.log("Cart: addItem - No user ID available, cannot add item");
      return;
    }

    console.log(`Cart: addItem - Attempting to add product ${item.id} to cart for user ${user.id}`, item);
    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.id
        });

      if (error) {
        console.error('Cart: addItem - Error inserting into cart_items:', error);
        throw error;
      }

      console.log(`Cart: addItem - Successfully added product ${item.id} to cart`);

      const cartItem: CartItem = {
        ...item,
        quantity: 1
      };

      setItems(prev => [...prev, cartItem]);
      console.log("Cart: addItem - Updated cart items in state:", [...items, cartItem]);
      
      return true;
    } catch (error) {
      console.error('Cart: addItem - Error adding item to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    if (!user?.id) {
      console.log("Cart: removeItem - No user ID available, cannot remove item");
      return;
    }

    console.log(`Cart: removeItem - Attempting to remove product ${itemId} from cart`);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', itemId);

      if (error) {
        console.error('Cart: removeItem - Error deleting from cart_items:', error);
        throw error;
      }

      console.log(`Cart: removeItem - Successfully removed product ${itemId} from cart`);
      setItems(prev => prev.filter(item => item.id !== itemId));
      toast({
        title: "Item removed",
        description: "Item has been removed from your cart."
      });
    } catch (error) {
      console.error('Cart: removeItem - Error removing item from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart"
      });
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    console.log(`Cart: updateQuantity - Updating quantity for product ${itemId} to ${quantity}`);
    setItems(prev =>
      prev.map(item =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async (silent: boolean = false) => {
    if (!user?.id) {
      console.log("Cart: clearCart - No user ID available, cannot clear cart");
      return;
    }

    console.log(`Cart: clearCart - Attempting to clear cart for user ${user.id}`);
    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) {
        console.error('Cart: clearCart - Error clearing cart:', error);
        throw error;
      }

      console.log("Cart: clearCart - Successfully cleared all cart items");
      setItems([]);
      
      if (!silent) {
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart."
        });
      }
    } catch (error) {
      console.error('Cart: clearCart - Error clearing cart:', error);
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
