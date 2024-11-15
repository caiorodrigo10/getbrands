import { Product } from "@/types/product";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { Calculator, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { useCartOperations } from "@/hooks/useCartOperations";
import { useToast } from "@/components/ui/use-toast";

interface ProductHeaderProps {
  product: Product;
}

const ProductHeader = ({ product }: ProductHeaderProps) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCartOperations();
  const { toast } = useToast();
  const profit = product.srp - product.from_price;

  const handleAddToCart = async () => {
    try {
      setIsLoading(true);
      await addItem(product.id);
      toast({
        title: "Product added to cart",
        description: "The product has been added to your cart successfully.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add product to cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCalculatorClick = () => {
    window.open(`/profit-calculator?productId=${product.id}`, '_blank');
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        {product.is_new && (
          <Badge variant="default" className="bg-primary">NEW</Badge>
        )}
        {product.is_tiktok && (
          <Badge variant="default" className="bg-pink-600">TIKTOK</Badge>
        )}
        <span className="text-sm text-gray-600">{product.category}</span>
      </div>

      <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

      <div className="grid grid-cols-3 gap-4 py-4">
        <div className="space-y-1">
          <p className="text-sm text-gray-600">From</p>
          <p className="text-2xl font-semibold text-gray-900">${product.from_price.toFixed(2)}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm text-gray-600">SRP</p>
          <p className="text-2xl font-semibold text-gray-900">${product.srp.toFixed(2)}</p>
        </div>
        <div className="bg-green-500 rounded-lg p-3 text-center">
          <p className="text-sm text-white">Profit</p>
          <p className="text-2xl font-semibold text-white">${profit.toFixed(2)}</p>
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <Button
          variant="default"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={isLoading}
        >
          <ShoppingCart className="w-4 h-4 mr-2" />
          {isLoading ? "Adding..." : "Add to Cart"}
        </Button>
        <Button
          variant="outline"
          size="lg"
          onClick={handleCalculatorClick}
        >
          <Calculator className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};

export default ProductHeader;