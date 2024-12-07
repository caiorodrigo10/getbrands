import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { Product } from "@/types/product";
import { trackEvent } from "@/lib/analytics";

interface ProductActionsProps {
  product: Product;
}

export const ProductActions = ({ product }: ProductActionsProps) => {
  const { addItem } = useCart();

  const handleAddToCart = async () => {
    await addItem(product);
    trackEvent('product_added_to_cart', { productId: product.id });
  };

  return (
    <div className="flex gap-2">
      <Button onClick={handleAddToCart} variant="default">
        Add to Cart
      </Button>
    </div>
  );
};