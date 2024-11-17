import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface ProductActionsProps {
  product: Product;
  onSelectProduct: () => void;
}

export const ProductActions = ({ product, onSelectProduct }: ProductActionsProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleRequestSample = async () => {
    setIsLoading(true);
    try {
      await addItem(product);
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

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:gap-4 px-4 sm:px-0">
      <Button 
        variant="outline" 
        size="lg" 
        className="w-full text-primary hover:text-primary border-2 border-primary hover:bg-primary/10 h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={handleRequestSample}
        disabled={isLoading}
      >
        {isLoading ? "Adding to cart..." : "Request Sample"}
      </Button>
      <Button 
        size="lg" 
        className="w-full bg-primary hover:bg-primary-dark text-white h-14 sm:h-12 text-base font-medium rounded-full"
        onClick={onSelectProduct}
      >
        Select Product
      </Button>
    </div>
  );
};