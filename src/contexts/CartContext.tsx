import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/types/product";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "./AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CartItem extends Product {
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product) => Promise<void>;
  removeItem: (id: string) => Promise<void>;
  updateQuantity: (id: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      loadCartItems();
    }
  }, [user]);

  const loadCartItems = async () => {
    try {
      setIsLoading(true);
      const { data: cartItems, error } = await supabase
        .from('cart_items')
        .select(`
          product_id,
          products (*)
        `)
        .eq('user_id', user?.id);

      if (error) throw error;

      const formattedItems = cartItems.map((item) => ({
        ...item.products,
        quantity: 1
      }));

      setItems(formattedItems);
    } catch (error) {
      console.error('Error loading cart items:', error);
      toast({
        variant: "destructive",
        title: "Erro ao carregar carrinho",
        description: "Não foi possível carregar seus itens. Tente novamente mais tarde.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const addItem = async (product: Product) => {
    if (!user) return;

    try {
      const { error } = await supabase
        .from('cart_items')
        .insert({
          user_id: user.id,
          product_id: product.id
        });

      if (error) {
        if (error.code === '23505') { // Unique violation
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
    }
  };

  const removeItem = async (id: string) => {
    if (!user) return;

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
    if (!user) return;

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

  return (
    <CartContext.Provider
      value={{ items, addItem, removeItem, updateQuantity, clearCart, isLoading }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}