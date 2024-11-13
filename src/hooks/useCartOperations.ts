import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { Product } from "@/types/product";
import { CartItem } from "@/types/cart";
import { User } from "@supabase/supabase-js";

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
          product_id,
          products (
            id,
            category,
            name,
            description,
            image_url,
            from_price,
            srp,
            is_new,
            is_tiktok,
            created_at,
            updated_at
          )
        `)
        .eq('user_id', user.id);

      if (error) throw error;

      const formattedItems = cartItems?.map((item) => ({
        ...item.products,
        quantity: 1
      })) || [];

      setItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      if (user?.id) {
        toast({
          variant: "destructive",
          title: "Erro ao carregar carrinho",
          description: "Não foi possível carregar seus itens. Tente novamente mais tarde.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (product: Product) => {
    if (!user?.id) {
      toast({
        variant: "destructive",
        title: "Erro",
        description: "Você precisa estar logado para adicionar itens ao carrinho.",
      });
      throw new Error("User not authenticated");
    }

    try {
      // First, check if the user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single();

      if (profileError || !profile) {
        toast({
          variant: "destructive",
          title: "Erro de perfil",
          description: "Seu perfil não foi encontrado. Por favor, faça login novamente.",
        });
        throw new Error("User profile not found");
      }

      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id
        });

      if (error) {
        if (error.code === '23505') {
          toast({
            description: "Este produto já está no seu carrinho.",
          });
          return;
        }
        throw error;
      }

      setItems((currentItems) => {
        const existingItem = currentItems.find((item) => item.id === product.id);
        if (existingItem) return currentItems;
        return [...currentItems, { ...product, quantity: 1 }];
      });

      toast({
        description: "Produto adicionado ao carrinho.",
      });
    } catch (error) {
      console.error('Error adding item to cart:', error);
      toast({
        variant: "destructive",
        title: "Erro ao adicionar item",
        description: "Não foi possível adicionar o item ao carrinho. Tente novamente mais tarde.",
      });
      throw error;
    }
  };

  const removeItem = async (id: string) => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id)
        .eq('product_id', id);

      if (error) throw error;

      setItems((currentItems) => currentItems.filter((item) => item.id !== id));
      
      toast({
        description: "Produto removido do carrinho.",
      });
    } catch (error) {
      console.error('Error removing item from cart:', error);
      toast({
        variant: "destructive",
        title: "Erro ao remover item",
        description: "Não foi possível remover o item do carrinho. Tente novamente mais tarde.",
      });
    }
  };

  const updateQuantity = async (id: string, quantity: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.id === id ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = async () => {
    if (!user?.id) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .delete()
        .eq('user_id', user.id);

      if (error) throw error;

      setItems([]);
      
      toast({
        description: "Carrinho limpo com sucesso.",
      });
    } catch (error) {
      console.error('Error clearing cart:', error);
      toast({
        variant: "destructive",
        title: "Erro ao limpar carrinho",
        description: "Não foi possível limpar o carrinho. Tente novamente mais tarde.",
      });
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