import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    navigate(`/catalog/${product.id}`);
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Ensure we have valid numbers for calculations
  const fromPrice = typeof product.from_price === 'number' ? product.from_price : 0;
  const srp = typeof product.srp === 'number' ? product.srp : 0;
  const profit = srp - fromPrice;

  return (
    <Card 
      className="bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer relative"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-gray-50">
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
        <img
          src={imageError ? '/placeholder.svg' : (product.image_url || '/placeholder.svg')}
          alt={product.name}
          className={`w-full h-full object-cover p-4 transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          loading="lazy"
        />
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
          <div className="bg-green-500 rounded-lg flex flex-col justify-center items-center h-full p-2">
            <p className="text-sm text-white">Profit</p>
            <p className="font-semibold text-white text-lg">${profit.toFixed(2)}</p>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;