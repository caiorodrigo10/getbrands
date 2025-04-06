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
import { useState, useEffect } from "react";

export function CartButton() {
  const navigate = useNavigate();
  const [totalQuantity, setTotalQuantity] = useState(0);
  
  // Use try/catch to gracefully handle when CartProvider isn't available
  let cartItems = [];
  try {
    const { items } = useCart();
    cartItems = items;
    
    // Update total quantity when items change
    useEffect(() => {
      const newTotalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);
      setTotalQuantity(newTotalQuantity);
    }, [items]);
  } catch (error) {
    console.error("CartButton: CartProvider not available", error);
    // Keep totalQuantity as 0
  }

  const handleCartClick = () => {
    // Track event before navigation
    trackEvent("Cart Viewed", {
      items_count: totalQuantity,
      items: cartItems.map(item => ({
        product_id: item?.id,
        product_name: item?.name,
        quantity: item?.quantity,
        price: item?.from_price
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
