
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
      console.log("[CART OPS] loadCartItems - No user ID available, skipping fetch");
      return;
    }
    
    console.log(`[CART OPS] loadCartItems - Attempting to fetch cart items for user ${user.id}`);
    setIsLoading(true);
    try {
      // First, get cart_items for the user
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select('product_id')
        .eq('user_id', user.id);

      if (cartError) {
        console.error('[CART OPS] loadCartItems - Error fetching cart items:', cartError);
        throw cartError;
      }

      console.log(`[CART OPS] loadCartItems - Retrieved ${cartItems?.length || 0} cart item references`);
      
      if (!cartItems || cartItems.length === 0) {
        console.log('[CART OPS] loadCartItems - No cart items found, setting empty array');
        setItems([]);
        return;
      }
      
      // Then, get the product details in a separate query
      const productIds = cartItems.map(item => item.product_id);
      console.log('[CART OPS] loadCartItems - Fetching product details for IDs:', productIds);
      
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
        
      if (productsError) {
        console.error('[CART OPS] loadCartItems - Error fetching products:', productsError);
        throw productsError;
      }

      console.log(`[CART OPS] loadCartItems - Retrieved ${products?.length || 0} product details:`, products);

      // Convert to cart items with quantity
      const cartItemsWithDetails: CartItem[] = products.map(product => ({
        ...product,
        quantity: 1
      }));

      setItems(cartItemsWithDetails);
      console.log("[CART OPS] loadCartItems - Processed cart items:", cartItemsWithDetails);
    } catch (error) {
      console.error('[CART OPS] loadCartItems - Error loading cart items:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Product): Promise<boolean> => {
    if (!user?.id) {
      console.log("[CART OPS] addItem - No user ID available, cannot add item");
      return false;
    }

    console.log(`[CART OPS] addItem - Attempting to add product ${item.id} to cart for user ${user.id}`, item);
    try {
      console.log('[CART OPS] addItem - Payload:', {
        user_id: user.id,
        product_id: item.id
      });
      
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.id
        })
        .select();

      if (error) {
        console.error('[CART OPS] addItem - Error inserting into cart_items:', error);
        throw error;
      }

      console.log(`[CART OPS] addItem - Successfully added product ${item.id} to cart, response:`, data);

      const cartItem: CartItem = {
        ...item,
        quantity: 1
      };

      setItems(prev => [...prev, cartItem]);
      console.log("[CART OPS] addItem - Updated cart items in state:", [...items, cartItem]);
      
      return true;
    } catch (error) {
      console.error('[CART OPS] addItem - Error adding item to cart:', error);
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
