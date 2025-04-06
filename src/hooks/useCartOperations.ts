import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";
import type { User } from "@supabase/supabase-js";

// Helper functions for local storage
const LOCAL_STORAGE_CART_KEY = 'getbrands_cart_items';

const getLocalCartItems = (): CartItem[] => {
  try {
    const savedItems = localStorage.getItem(LOCAL_STORAGE_CART_KEY);
    return savedItems ? JSON.parse(savedItems) : [];
  } catch (e) {
    console.log("[CART OPS] Error reading from local storage:", e);
    return [];
  }
};

const saveLocalCartItems = (items: CartItem[]) => {
  try {
    localStorage.setItem(LOCAL_STORAGE_CART_KEY, JSON.stringify(items));
  } catch (e) {
    console.log("[CART OPS] Error saving to local storage:", e);
  }
};

export const useCartOperations = (user: User | null) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const [useLocalStorage, setUseLocalStorage] = useState(false);

  // Initialize with local storage on first load
  useEffect(() => {
    if (!user) {
      const localItems = getLocalCartItems();
      setItems(localItems);
    }
  }, []);

  // Load items from database or local storage
  const loadCartItems = async () => {
    if (!user?.id) {
      console.log("[CART OPS] loadCartItems - No user ID available, using local storage");
      const localItems = getLocalCartItems();
      setItems(localItems);
      return;
    }
    
    console.log(`[CART OPS] loadCartItems - Attempting to fetch cart items for user ${user.id}`);
    setIsLoading(true);
    try {
      // First, get cart_items for the user
      console.log("[CART OPS] loadCartItems - Sending request for cart_items");
      const { data: cartItems, error: cartError } = await supabase
        .from('cart_items')
        .select('product_id')
        .eq('user_id', user.id);

      console.log("[CART OPS] loadCartItems - Response received:", { cartItems, error: cartError });

      if (cartError) {
        console.error('[CART OPS] loadCartItems - Error fetching cart items:', cartError);
        console.error('[CART OPS] Error details:', { 
          message: cartError.message, 
          details: cartError.details,
          hint: cartError.hint,
          code: cartError.code
        });
        
        // Switch to local storage mode if we get permission errors
        if (cartError.code === '42501') {
          console.log("[CART OPS] Switching to local storage mode due to permission issue");
          setUseLocalStorage(true);
          const localItems = getLocalCartItems();
          setItems(localItems);
          return;
        }
        
        throw cartError;
      }

      console.log(`[CART OPS] loadCartItems - Retrieved ${cartItems?.length || 0} cart item references`);
      
      if (!cartItems || cartItems.length === 0) {
        console.log('[CART OPS] loadCartItems - No cart items found, setting empty array');
        setItems([]);
        saveLocalCartItems([]);
        return;
      }
      
      // Then, get the product details in a separate query
      const productIds = cartItems.map(item => item.product_id);
      console.log('[CART OPS] loadCartItems - Fetching product details for IDs:', productIds);
      
      const { data: products, error: productsError } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);
        
      console.log("[CART OPS] loadCartItems - Products query response:", { 
        products, 
        error: productsError,
        errorMessage: productsError?.message 
      });

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
      saveLocalCartItems(cartItemsWithDetails);
      console.log("[CART OPS] loadCartItems - Processed cart items:", cartItemsWithDetails);
    } catch (error: any) {
      console.error('[CART OPS] loadCartItems - Error loading cart items:', error);
      console.error('[CART OPS] Stack trace:', error?.stack);
      
      // Fallback to local storage in case of any error
      const localItems = getLocalCartItems();
      setItems(localItems);
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (item: Product): Promise<boolean> => {
    console.log(`[CART OPS] addItem - Attempting to add product ${item.id} to cart`, item);
    
    // Check if we're in local storage mode or if there's no user
    if (useLocalStorage || !user?.id) {
      console.log('[CART OPS] addItem - Using local storage mode');
      const currentItems = getLocalCartItems();
      
      // Check if item already exists in cart
      const existingItem = currentItems.find(cartItem => cartItem.id === item.id);
      if (existingItem) {
        console.log('[CART OPS] addItem - Item already exists in local cart, not adding again');
        return true;
      }
      
      const cartItem: CartItem = {
        ...item,
        quantity: 1
      };
      
      const updatedItems = [...currentItems, cartItem];
      saveLocalCartItems(updatedItems);
      setItems(updatedItems);
      console.log('[CART OPS] addItem - Added item to local storage cart:', cartItem);
      return true;
    }
    
    try {
      console.log('[CART OPS] addItem - Preparing payload:', {
        user_id: user.id,
        product_id: item.id
      });
      
      // First check if item is already in cart
      console.log('[CART OPS] addItem - Checking if item already exists in cart');
      const { data: existingItems, error: checkError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', user.id)
        .eq('product_id', item.id);
        
      if (checkError) {
        console.error('[CART OPS] addItem - Error checking existing items:', checkError);
        console.error('[CART OPS] Error details:', { 
          message: checkError.message, 
          details: checkError.details,
          hint: checkError.hint,
          code: checkError.code
        });
        
        // Switch to local storage mode if we get permission errors
        if (checkError.code === '42501') {
          console.log("[CART OPS] Switching to local storage mode due to permission issue");
          setUseLocalStorage(true);
          return addItem(item);
        }
        
        throw checkError;
      }
      
      console.log('[CART OPS] addItem - Check result:', existingItems);
      
      // If item already exists, don't add it again
      if (existingItems && existingItems.length > 0) {
        console.log('[CART OPS] addItem - Item already exists in cart, not adding again');
        
        // Still update the local state to ensure UI is correct
        if (!items.some(cartItem => cartItem.id === item.id)) {
          const cartItem: CartItem = {
            ...item,
            quantity: 1
          };
          setItems(prev => [...prev, cartItem]);
          console.log("[CART OPS] addItem - Updated local cart state for existing item");
        }
        
        return true;
      }
      
      console.log('[CART OPS] addItem - Sending insert request to cart_items table');
      const { data, error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: item.id
        })
        .select();
      
      console.log('[CART OPS] addItem - Insert response:', { data, error });

      if (error) {
        console.error('[CART OPS] addItem - Error inserting into cart_items:', error);
        console.error('[CART OPS] Error details:', { 
          message: error.message, 
          details: error.details,
          hint: error.hint,
          code: error.code
        });
        
        // Switch to local storage mode if we get permission errors
        if (error.code === '42501') {
          console.log("[CART OPS] Switching to local storage mode due to permission issue");
          setUseLocalStorage(true);
          return addItem(item);
        }
        
        throw error;
      }

      console.log(`[CART OPS] addItem - Successfully added product ${item.id} to cart, response:`, data);

      const cartItem: CartItem = {
        ...item,
        quantity: 1
      };

      setItems(prev => [...prev, cartItem]);
      saveLocalCartItems([...items, cartItem]);
      console.log("[CART OPS] addItem - Updated cart items in state:", [...items, cartItem]);
      return true;
    } catch (error: any) {
      console.error('[CART OPS] addItem - Error adding item to cart:', error);
      console.error('[CART OPS] Error stack:', error?.stack);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart"
      });
      return false;
    }
  };

  const removeItem = async (itemId: string) => {
    // Handle removal in local storage if needed
    if (useLocalStorage || !user?.id) {
      console.log(`[CART OPS] removeItem - Using local storage mode for product ${itemId}`);
      const currentItems = getLocalCartItems();
      const updatedItems = currentItems.filter(item => item.id !== itemId);
      saveLocalCartItems(updatedItems);
      setItems(updatedItems);
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
        
        // Switch to local storage mode if needed
        if (error.code === '42501') {
          setUseLocalStorage(true);
          return removeItem(itemId);
        }
        
        throw error;
      }

      console.log(`Cart: removeItem - Successfully removed product ${itemId} from cart`);
      const updatedItems = items.filter(item => item.id !== itemId);
      setItems(updatedItems);
      saveLocalCartItems(updatedItems);
    } catch (error) {
      console.error('Cart: removeItem - Error removing item from cart:', error);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    console.log(`Cart: updateQuantity - Updating quantity for product ${itemId} to ${quantity}`);
    const updatedItems = items.map(item =>
      item.id === itemId ? { ...item, quantity } : item
    );
    setItems(updatedItems);
    saveLocalCartItems(updatedItems);
  };

  const clearCart = async (silent: boolean = false) => {
    // Handle clear in local storage if needed
    if (useLocalStorage || !user?.id) {
      console.log("[CART OPS] clearCart - Using local storage mode");
      setItems([]);
      saveLocalCartItems([]);
      
      if (!silent) {
        toast({
          title: "Cart cleared",
          description: "All items have been removed from your cart."
        });
      }
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
        
        // Switch to local storage mode if needed
        if (error.code === '42501') {
          setUseLocalStorage(true);
          return clearCart(silent);
        }
        
        throw error;
      }

      console.log("Cart: clearCart - Successfully cleared all cart items");
      setItems([]);
      saveLocalCartItems([]);
      
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
