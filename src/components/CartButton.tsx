import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate, useLocation } from "react-router-dom";
import { trackCartView } from "@/lib/analytics/events";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function CartButton() {
  const { items } = useCart();
  const navigate = useNavigate();
  const location = useLocation();

  const handleCartClick = async () => {
    console.log('[DEBUG] CartButton - Click event triggered');
    
    if (items.length === 0) {
      console.log('[DEBUG] CartButton - Cart is empty, not navigating');
      return;
    }

    try {
      console.log('[DEBUG] CartButton - Current location:', location.pathname);
      console.log('[DEBUG] CartButton - Cart items:', items);
      
      await trackCartView({
        items: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity,
          price: item.from_price
        })),
        items_count: items.length
      });

      console.log('[DEBUG] CartButton - Navigation attempt to /checkout/confirmation');
      navigate("/checkout/confirmation");
      console.log('[DEBUG] CartButton - Navigation completed');
    } catch (error) {
      console.error('[DEBUG] CartButton - Error during navigation:', error);
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
            {items.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {items.length}
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