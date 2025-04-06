
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

  // Load cart items on mount and log
  useEffect(() => {
    console.log("CartButton: Mounted, loading cart items");
    loadCartItems().then(() => {
      console.log("CartButton: Finished loading cart items");
    }).catch(error => {
      console.error("CartButton: Error loading cart items:", error);
    });
  }, []);

  // Calculate total quantity considering the quantity of each item
  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
  console.log("CartButton: Current cart has", totalQuantity, "items");

  const handleCartClick = () => {
    console.log("CartButton: Cart button clicked, navigating to checkout");
    // Track event before navigation
    trackEvent("Cart Viewed", {
      items_count: totalQuantity,
      items: items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity,
        price: item.from_price
      }))
    });

    // Navigate to confirmation page
    navigate("/checkout/confirmation");
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
