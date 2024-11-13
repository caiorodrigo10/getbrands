import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ProductCardProps {
  product: {
    id: number;
    category: string;
    name: string;
    image: string;
    fromPrice: number;
    srp: number;
    profit: number;
    isNew?: boolean;
    isTiktok?: boolean;
  };
  onRequestSample: (id: number) => void;
  onSelectProduct: (id: number) => void;
}

const ProductCard = ({ product, onRequestSample, onSelectProduct }: ProductCardProps) => {
  return (
    <Card className="bg-gray-950 border-gray-800 overflow-hidden">
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
        <div className="text-sm text-gray-400 mb-2">{product.category}</div>
        <h3 className="text-lg font-semibold text-white mb-4">{product.name}</h3>
        
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div>
            <p className="text-sm text-gray-400">From</p>
            <p className="font-semibold text-white">${product.fromPrice.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">SRP</p>
            <p className="font-semibold text-white">${product.srp.toFixed(2)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-400">Profit</p>
            <p className="font-semibold text-green-500">${product.profit.toFixed(2)}</p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button 
            variant="outline" 
            className="flex-1 text-primary hover:text-primary"
            onClick={() => onRequestSample(product.id)}
          >
            Pedir Amostra
          </Button>
          <Button 
            className="flex-1"
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