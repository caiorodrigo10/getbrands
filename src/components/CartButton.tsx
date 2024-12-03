import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { trackEvent } from "@/lib/analytics";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useEffect } from "react";

export function CartButton() {
  const { items, loadCartItems } = useCart();
  const navigate = useNavigate();

  // Load cart items when component mounts
  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  // Calculate total quantity considering the quantity of each item
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = async () => {
    try {
      // Ensure cart items are loaded before navigation
      await loadCartItems();
      
      trackEvent("Cart Viewed", {
        items_count: totalQuantity,
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.from_price
        }))
      });

      navigate("/checkout/confirmation");
    } catch (error) {
      console.error("Error loading cart items:", error);
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="outline"
            size="icon"
            className="relative"
            onClick={handleCartClick}
          >
            <ShoppingCart className="h-5 w-5" />
            {totalQuantity > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>View cart</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CartButton;