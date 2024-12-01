import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Badge } from "@/components/ui/badge";

export const CartButton = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  return (
    <Button
      variant="outline"
      size="icon"
      className="relative"
      onClick={() => navigate("/checkout")}
    >
      <ShoppingCart className="h-5 w-5" />
      {items.length > 0 && (
        <Badge 
          variant="destructive" 
          className="absolute -top-2 -right-2 h-5 w-5 flex items-center justify-center p-0 text-xs"
        >
          {items.length}
        </Badge>
      )}
    </Button>
  );
};