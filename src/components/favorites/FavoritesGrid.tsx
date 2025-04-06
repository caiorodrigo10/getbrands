
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useFavorites } from "@/hooks/useFavorites";
import SimpleProductCard from "@/components/SimpleProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const FavoritesGrid = () => {
  const { favorites, isLoading: favoritesLoading } = useFavorites();
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();

  // Get all favorited products
  const { data: favoriteProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['favorite-products', favorites.map(f => f.product_id).join(',')],
    queryFn: async () => {
      if (!favorites.length) return [];
      
      const productIds = favorites.map(fav => fav.product_id);
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', productIds);

      if (error) throw error;
      return data as Product[];
    },
    enabled: favorites.length > 0,
  });

  useEffect(() => {
    if (favoriteProducts) {
      setProducts(favoriteProducts);
    }
  }, [favoriteProducts]);

  const isLoading = favoritesLoading || productsLoading;

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, idx) => (
          <Skeleton key={idx} className="h-[300px] w-full" />
        ))}
      </div>
    );
  }

  if (!favorites.length || !products.length) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <Star size={64} className="text-gray-300 mb-4" />
        <h2 className="text-2xl font-semibold mb-4">No favorites yet</h2>
        <p className="text-gray-500 mb-6">
          Products you add to your favorites will appear here
        </p>
        <Button onClick={() => navigate('/catalog')}>
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <SimpleProductCard
          key={product.id}
          product={product}
          clickable
        />
      ))}
    </div>
  );
};
