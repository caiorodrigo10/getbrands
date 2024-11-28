import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const { data: productImages } = useQuery({
    queryKey: ['product-images', product.id],
    queryFn: async () => {
      if (!product.id) return [];
      
      const { data, error } = await supabase
        .from('product_images')
        .select('*')
        .eq('product_id', product.id)
        .order('position');

      if (error) throw error;
      return data || [];
    },
    enabled: Boolean(product.id),
  });

  const handleCardClick = () => {
    navigate(`/catalog/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Get the primary image and secondary image for hover effect
  const primaryImage = productImages?.find(img => img.is_primary)?.image_url || 
                      productImages?.[0]?.image_url ||
                      product.image_url || 
                      '/placeholder.svg';
                      
  const secondaryImage = productImages?.[1]?.image_url || primaryImage;

  // Ensure we have valid numbers for calculations
  const fromPrice = typeof product.from_price === 'number' ? product.from_price : 0;
  const srp = typeof product.srp === 'number' ? product.srp : 0;
  const profit = srp - fromPrice;

  return (
    <Card 
      className="bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer relative"
      onClick={handleCardClick}
    >
      <div 
        className="relative aspect-square bg-gray-50"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        {product.is_new && (
          <Badge className="absolute top-6 right-6 z-10 bg-primary">
            NEW
          </Badge>
        )}
        {product.is_tiktok && (
          <Badge className="absolute top-6 right-6 z-10 bg-pink-600">
            TIKTOK
          </Badge>
        )}
        <Badge 
          variant="outline" 
          className="absolute top-6 left-6 z-10 bg-white/80 backdrop-blur-sm text-xs font-normal"
        >
          1000 points
        </Badge>
        <div className="relative w-full h-full">
          <img
            src={imageError ? '/placeholder.svg' : primaryImage}
            alt={`${product.name} - Primary`}
            className={`absolute inset-0 w-full h-full object-cover p-4 transition-opacity duration-300 ${
              isHovered ? 'opacity-0' : 'opacity-100'
            }`}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />
          <img
            src={imageError ? '/placeholder.svg' : secondaryImage}
            alt={`${product.name} - Secondary`}
            className={`absolute inset-0 w-full h-full object-cover p-4 transition-opacity duration-300 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onError={handleImageError}
            loading="lazy"
          />
        </div>
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">{product.category}</div>
        <h3 className="text-2xl font-semibold text-gray-900 mb-4 min-h-[4rem] line-clamp-2">
          {product.name}
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex flex-col justify-between h-full">
            <p className="text-sm text-gray-600">From</p>
            <p className="font-semibold text-gray-900 text-lg">${fromPrice.toFixed(2)}</p>
          </div>
          <div className="flex flex-col justify-between h-full">
            <p className="text-sm text-gray-600">SRP</p>
            <p className="font-semibold text-gray-900 text-lg">${srp.toFixed(2)}</p>
          </div>
          <div className="bg-[#08af71] rounded-lg flex flex-col justify-center items-center h-full p-2">
            <p className="text-sm text-white">Profit</p>
            <p className="font-semibold text-white text-lg">${profit.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;