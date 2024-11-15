import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";

const CartReview = () => {
  const navigate = useNavigate();
  const { items } = useCart();

  const handleContinue = () => {
    navigate("/checkout/shipping");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm">
        <h2 className="text-lg sm:text-xl font-semibold mb-4">Review your order</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-3 border-b">
              <div className="flex items-center space-x-3">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-12 h-12 sm:w-16 sm:h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium text-sm sm:text-base">{item.name}</h3>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium text-sm sm:text-base">
                {formatCurrency(item.from_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          size="sm"
          className="w-full sm:w-auto"
        >
          Continue to shipping
        </Button>
      </div>
    </div>
  );
};

export default CartReview;