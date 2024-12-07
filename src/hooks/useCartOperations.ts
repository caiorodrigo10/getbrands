import { useState } from 'react';
import { CartItem } from '@/types/cart';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useCartOperations = () => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addItem = async (item: CartItem) => {
    try {
      setIsLoading(true);
      const { data: existingItem, error: fetchError } = await supabase
        .from('cart_items')
        .select('*')
        .eq('user_id', item.user_id)
        .eq('product_id', item.id)
        .single();

      if (fetchError && fetchError.code !== 'PGRST116') {
        throw fetchError;
      }

      if (existingItem) {
        const { error: updateError } = await supabase
          .from('cart_items')
          .update({ quantity: existingItem.quantity + 1 })
          .eq('id', existingItem.id);

        if (updateError) throw updateError;
      } else {
        const { error: insertError } = await supabase
          .from('cart_items')
          .insert([
            {
              user_id: item.user_id,
              product_id: item.id,
              quantity: 1,
            },
          ]);

        if (insertError) throw insertError;
      }

      // Update local state
      const updatedItems = [...items];
      const existingItemIndex = updatedItems.findIndex((i) => i.id === item.id);
      
      if (existingItemIndex >= 0) {
        updatedItems[existingItemIndex].quantity += 1;
      } else {
        updatedItems.push({ ...item, quantity: 1 });
      }
      
      setItems(updatedItems);
      toast.success('Item added to cart');
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast.error('Failed to add item to cart');
    } finally {
      setIsLoading(false);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => total + (item.from_price * item.quantity), 0);
  };

  return {
    items,
    setItems,
    addItem,
    isLoading,
    calculateTotal,
  };
};