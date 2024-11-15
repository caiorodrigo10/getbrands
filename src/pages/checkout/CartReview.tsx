import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const CartReview = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  const handleContinue = () => {
    navigate("/checkout/shipping");
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-3 sm:p-4 border-b">
          <h2 className="text-base sm:text-lg font-medium">Review your order</h2>
        </div>
        
        <div className="divide-y">
          {items.map((item) => (
            <div key={item.id} className="p-3 sm:p-4">
              <div className="flex items-start space-x-3">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium truncate">{item.name}</h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    Quantity: {item.quantity}
                  </p>
                  <p className="text-sm font-medium mt-1">
                    {formatCurrency(item.from_price * item.quantity)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t sm:relative sm:border-0 sm:p-0 sm:bg-transparent">
        <Button
          onClick={handleContinue}
          className="w-full sm:w-auto h-11"
        >
          Continue to shipping
        </Button>
      </div>
      
      {/* Add padding at the bottom on mobile to account for fixed button */}
      <div className="h-20 sm:h-0"></div>
    </div>
  );
};

export default CartReview;