import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface ProductCardProps {
  product: Product;
  onRequestSample: (id: number) => void;
  onSelectProduct: (id: number) => void;
}

const ProductCard = ({ product, onRequestSample, onSelectProduct }: ProductCardProps) => {
  const navigate = useNavigate();

  const handleRequestSample = () => {
    onRequestSample(product.id);
    navigate("/pedido-amostra");
  };

  return (
    <Card className="bg-gray-50 border-gray-200 overflow-hidden">
      <div className="relative aspect-square">
        {product.isNew && (
          <Badge className="absolute top-4 right-4 z-10 bg-primary">
            NOVO
          </Badge>
        )}
        {product.isTiktok && (
          <Badge className="absolute top-4 right-4 z-10 bg-pink-600">
            TIKTOK
          </Badge>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-contain p-4"
        />
      </div>
      <div className="p-4">
        <div className="text-sm text-gray-600 mb-2">{product.category}</div>
        <h3 className="text-lg font-semibold text-gray-900 mb-4 min-h-[3.5rem] line-clamp-2">{product.name}</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-600">From</p>
            <p className="font-semibold text-gray-900">${product.fromPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">SRP</p>
            <p className="font-semibold text-gray-900">${product.srp.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Profit</p>
            <p className="font-semibold text-green-600">${product.profit.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-primary hover:text-primary border-primary hover:bg-primary/10"
            onClick={handleRequestSample}
          >
            Pedir Amostra
          </Button>
          <Button 
            className="flex-1 bg-primary hover:bg-primary-dark text-white"
            onClick={() => onSelectProduct(product.id)}
          >
            Selecionar
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default ProductCard;