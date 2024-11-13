import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";

interface ProductCardProps {
  product: Product;
  onRequestSample: (id: string) => void;
  onSelectProduct: (id: string) => void;
}

const ProductCard = ({ product, onRequestSample, onSelectProduct }: ProductCardProps) => {
  const navigate = useNavigate();
  const { addItem } = useCart();
  const { toast } = useToast();
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleRequestSample = async () => {
    try {
      await addItem(product);
      onRequestSample(product.id);
      navigate("/pedido-amostra");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erro ao adicionar produto",
        description: "Não foi possível adicionar o produto ao carrinho. Tente novamente.",
      });
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
          <Badge className="absolute top-4 right-4 z-10 bg-primary">
            NEW
          </Badge>
        )}
        {product.is_tiktok && (
          <Badge className="absolute top-4 right-4 z-10 bg-pink-600">
            TIKTOK
          </Badge>
        )}
        <img
          src={imageError ? '/placeholder.svg' : (product.image_url || '/placeholder.svg')}
          alt={product.name}
          className={`w-full h-full object-contain p-4 transition-opacity duration-200 ${
            imageLoaded ? "opacity-100" : "opacity-0"
          }`}
          onLoad={() => setImageLoaded(true)}
          onError={handleImageError}
          loading="lazy"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">{product.category}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 min-h-[3.5rem] line-clamp-2">
          {product.name}
        </h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-semibold text-gray-900">${product.from_price.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SRP</p>
            <p className="font-semibold text-gray-900">${product.srp.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profit</p>
            <p className="font-semibold text-green-600">${profit.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-primary hover:text-primary border-primary hover:bg-primary/10"
            onClick={handleRequestSample}
          >
            Request Sample
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            onClick={() => onSelectProduct(product.id)}
          >
            Select
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;