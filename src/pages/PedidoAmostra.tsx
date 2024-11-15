import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { useWindowSize } from "@/hooks/useWindowSize";

const CartReview = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { width } = useWindowSize();
  const isMobile = width < 640;

  const handleContinue = () => {
    navigate("/checkout/shipping");
  };

  const total = items.reduce((sum, item) => sum + item.from_price * item.quantity, 0);

  return (
    <div className="space-y-4">
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b">
          <h2 className="text-base font-medium">Review your order</h2>
        </div>
        
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm sm:text-base font-medium line-clamp-2">
                    {item.name}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Quantity: {item.quantity}
                  </p>
                  {!isMobile && (
                    <p className="text-sm font-medium mt-1">
                      {formatCurrency(item.from_price * item.quantity)}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t sm:relative sm:border-0 sm:p-0 sm:bg-transparent">
        <div className="mb-2 flex justify-between items-center">
          <span className="text-sm font-medium">Total:</span>
          <span className="text-sm font-bold">{formatCurrency(total)}</span>
        </div>
        <Button
          onClick={handleContinue}
          className="w-full sm:w-auto h-9 sm:h-11 text-sm"
        >
          Continue to shipping
        </Button>
      </div>
      
      {/* Add padding at the bottom on mobile to account for fixed button */}
      <div className="h-24 sm:h-0"></div>
    </div>
  );
};

export default CartReview;