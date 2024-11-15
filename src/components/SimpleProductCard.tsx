import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

interface SimpleProductCardProps {
  product: Product;
  projectName?: string;
}

const SimpleProductCard = ({ product, projectName }: SimpleProductCardProps) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleCardClick = () => {
    if (product?.id) {
      navigate(`/catalog/${product.id}`);
    }
  };

  return (
    <Card 
      className="bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200 cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="relative aspect-square bg-gray-50">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-100 animate-pulse" />
        )}
        <img
          src={imageError ? '/placeholder.svg' : (product.image_url || '/placeholder.svg')}
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