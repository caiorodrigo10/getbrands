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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useEffect } from "react";

export function CartButton() {
  const { items, loadCartItems } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    loadCartItems();
  }, [loadCartItems]);

  const totalQuantity = items.reduce((sum, item) => sum + item.quantity, 0);

  const handleCartClick = () => {
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
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <Popover>
          <PopoverTrigger asChild>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="relative"
              >
                <ShoppingCart className="h-5 w-5" />
                {totalQuantity > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {totalQuantity}
                  </span>
                )}
              </Button>
            </TooltipTrigger>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 space-y-4">
              <h3 className="font-medium">Carrinho</h3>
              {items.length > 0 ? (
                <>
                  <div className="space-y-3">
                    {items.map((item) => (
                      <div key={item.id} className="flex items-center gap-3">
                        <img
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          className="h-12 w-12 rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            Qtd: {item.quantity} × ${item.from_price}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <Button 
                    className="w-full"
                    onClick={handleCartClick}
                  >
                    Finalizar Pedido
                  </Button>
                </>
              ) : (
                <p className="text-sm text-muted-foreground text-center py-4">
                  Seu carrinho está vazio
                </p>
              )}
            </div>
          </PopoverContent>
        </Popover>
        <TooltipContent>
          <p>Ver carrinho</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

export default CartButton;