import React, { createContext, useContext, useState, useCallback } from 'react';
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import type { CartItem } from "@/types/cart";
import type { Product } from "@/types/product";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const addItem = useCallback(async (product: Product) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .insert([
          { 
            product_id: product.id,
            user_id: (await supabase.auth.getUser()).data.user?.id 
          }
        ]);

      if (error) throw error;

      setItems(prev => [...prev, { ...product, quantity: 1 }]);
      
      toast({
        title: "Success",
        description: "Item added to cart",
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add item to cart",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const removeItem = useCallback(async (id: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('product_id', id);

      if (error) throw error;

      setItems(prev => prev.filter(item => item.id !== id));
      
      toast({
        title: "Success",
        description: "Item removed from cart",
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to remove item from cart",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const updateQuantity = useCallback(async (id: string, quantity: number) => {
    try {
      setIsLoading(true);
      setItems(prev => 
        prev.map(item => 
          item.id === id ? { ...item, quantity } : item
        )
      );
    } catch (error) {
      console.error('Error updating quantity:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update quantity",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const clearCart = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .neq('id', 'placeholder');

      if (error) throw error;

      setItems([]);
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return (
    <CartContext.Provider 
      value={{ 
        items, 
        addItem, 
        removeItem, 
        updateQuantity, 
        clearCart, 
        isLoading 
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};