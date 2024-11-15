import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import ProductActions from "./product/ProductActions";

interface ProductCardProps {
  product: Product;
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const ProductCard = ({ 
  product, 
  onRequestSample, 
  onSelectProduct,
}: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleRequestSample = async () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "You must be logged in to request samples.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await addItem(product);
      onRequestSample(product.id);
      toast({
        title: "Success",
        description: "Product added to cart successfully.",
      });
      navigate("/checkout/confirmation");
    } catch (error) {
      console.error('Error adding product to cart:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  const profit = product.srp - product.from_price;

  return (
    <Card className="bg-white border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-200">
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
            <p className="font-semibold text-gray-900 text-2xl">${product.from_price.toFixed(2)}</p>
          </div>
          <div className="flex flex-col justify-between h-full">
            <p className="text-sm text-gray-600">SRP</p>
            <p className="font-semibold text-gray-900 text-2xl">${product.srp.toFixed(2)}</p>
          </div>
          <div className="bg-green-500 rounded-lg flex flex-col justify-between h-full p-2">
            <p className="text-sm text-white">Profit</p>
            <p className="font-semibold text-white text-2xl">${profit.toFixed(2)}</p>
          </div>
        </div>

        <ProductActions
          productId={product.id}
          onRequestSample={handleRequestSample}
          isLoading={isLoading}
        />
      </div>
    </Card>
  );
};

export default ProductCard;