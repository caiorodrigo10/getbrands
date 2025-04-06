
import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type Favorite = {
  id: string;
  user_id: string;
  product_id: string;
  created_at: string;
};

export const useFavorites = () => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [favoritesMap, setFavoritesMap] = useState<Record<string, boolean>>({});

  // Fetch all favorites for the current user
  const fetchFavorites = useCallback(async () => {
    if (!user) {
      setFavorites([]);
      setFavoritesMap({});
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      // We need to explicitly type the table for TypeScript
      const { data, error } = await supabase
        .from("user_favorites")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      // Ensure we cast the data to Favorite[] type
      const favoritesData = data as unknown as Favorite[];
      setFavorites(favoritesData || []);
      
      // Create a map for quick lookup
      const map: Record<string, boolean> = {};
      favoritesData?.forEach(favorite => {
        map[favorite.product_id] = true;
      });
      setFavoritesMap(map);
    } catch (error) {
      console.error("Error fetching favorites:", error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  // Check if a product is favorited
  const isFavorite = useCallback((productId: string): boolean => {
    return !!favoritesMap[productId];
  }, [favoritesMap]);

  // Toggle favorite status
  const toggleFavorite = useCallback(async (productId: string) => {
    if (!user) {
      toast.error("You need to be logged in to favorite products");
      return false;
    }

    try {
      if (isFavorite(productId)) {
        // Remove from favorites
        const { error } = await supabase
          .from("user_favorites")
          .delete()
          .eq("user_id", user.id)
          .eq("product_id", productId);

        if (error) throw error;

        setFavorites(prev => prev.filter(fav => fav.product_id !== productId));
        setFavoritesMap(prev => ({ ...prev, [productId]: false }));
        toast.success("Removed from favorites");
      } else {
        // Add to favorites
        const { data, error } = await supabase
          .from("user_favorites")
          .insert({ user_id: user.id, product_id: productId })
          .select()
          .single();

        if (error) throw error;
        
        // Cast data to Favorite type
        const newFavorite = data as unknown as Favorite;
        setFavorites(prev => [...prev, newFavorite]);
        setFavoritesMap(prev => ({ ...prev, [productId]: true }));
        toast.success("Added to favorites");
      }
      return true;
    } catch (error) {
      console.error("Error toggling favorite:", error);
      toast.error("Failed to update favorites");
      return false;
    }
  }, [user, isFavorite]);

  // Load favorites when the user changes
  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites, user]);

  return {
    favorites,
    isLoading,
    isFavorite,
    toggleFavorite,
    refreshFavorites: fetchFavorites
  };
};
