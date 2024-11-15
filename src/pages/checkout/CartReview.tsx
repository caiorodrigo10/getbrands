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
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Review your order</h2>
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between py-4 border-b">
              <div className="flex items-center space-x-4">
                <img
                  src={item.image_url || "/placeholder.svg"}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded"
                />
                <div>
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {item.quantity}
                  </p>
                </div>
              </div>
              <p className="font-medium">
                {formatCurrency(item.from_price * item.quantity)}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          onClick={handleContinue}
          className="w-full md:w-auto"
        >
          Continue to shipping
        </Button>
      </div>
    </div>
  );
};

export default CartReview;