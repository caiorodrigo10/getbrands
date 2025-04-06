
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { FavoriteButton } from "./favorites/FavoriteButton";

interface SimpleProductCardProps {
  product: Product;
  projectName?: string;
  clickable?: boolean; // Add this prop to control if the card is clickable
}

const SimpleProductCard = ({ product, projectName, clickable = true }: SimpleProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const { data: productImages } = useQuery({
    queryKey: ['product-images', product.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position');

      if (error) throw error;
      return data;
    },
  });

  const handleCardClick = () => {
    if (clickable && product?.id) {
      navigate(`/catalog/${product.id}`);
    }
  };

  // Get the primary image or fall back to the product's main image
  const displayImage = productImages?.find(img => img.is_primary)?.image_url || 
                      product.image_url || 
                      '/placeholder.svg';

  return (
    <Card 
      className={`bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 ${
        clickable ? 'cursor-pointer' : ''
      }`}
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-gray-50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <div className="absolute bottom-4 right-4 z-10">
          <FavoriteButton productId={product.id} size="sm" />
        </div>
        <img
          src={imageError ? '/placeholder.svg' : displayImage}
          alt={product.name}
          className={`w-full h-full object-cover p-4 transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={() => {
            setImageError(true);
            setImageLoaded(true);
          }}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">{product.category}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        {projectName && (
          <div className="text-sm text-gray-600">
            Project: {projectName}
          </div>
        )}
      </div>
    </Card>
  );
};

export default SimpleProductCard;
