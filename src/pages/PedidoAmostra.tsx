import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { trackCheckoutStep } from "@/lib/analytics/ecommerce";
import OrderDetails from "@/components/checkout/OrderDetails";
import { Card } from "@/components/ui/card";

const PedidoAmostra = () => {
  const navigate = useNavigate();
  const { items } = useCart();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    trackCheckoutStep(1, items);
  }, [items]);

  const handleProceedToShipping = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      if (!items.length) {
        toast({
          variant: "destructive",
          title: "Cart is empty",
          description: "Please add items to your cart before proceeding.",
        });
        navigate("/catalog");
        return;
      }
      navigate("/checkout/shipping");
    } catch (error) {
      console.error("Navigation error:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (!items.length) {
    return (
      <div className="text-center py-8">
        <h2 className="text-2xl font-semibold mb-4">Your cart is empty</h2>
        <Button onClick={() => navigate("/catalog")}>
          Browse Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4">
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-6">Order Review</h2>
          <OrderDetails items={items} />
        </Card>

        <div className="flex justify-end mt-6">
          <Button
            onClick={handleProceedToShipping}
            disabled={isProcessing || !items.length}
            className="w-full sm:w-auto text-base px-6 py-3 h-12"
          >
            {isProcessing ? "Processing..." : "Proceed to Shipping"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PedidoAmostra;