import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { Card } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { ProductListItem } from "@/components/sample-order/ProductListItem";
import { OrderSummary } from "@/components/sample-order/OrderSummary";
import { ShippingCountrySelect } from "@/components/sample-order/ShippingCountrySelect";
import { ActionButtons } from "@/components/sample-order/ActionButtons";

export default function PedidoAmostra() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart } = useCart();
  const { toast } = useToast();
  const [selectedCountry, setSelectedCountry] = useState("US");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (items.length === 0) {
      navigate("/catalog");
    }
  }, [items.length, navigate]);

  const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
  const shippingCost = 4.50; // Fixed shipping cost
  const total = subtotal + shippingCost;

  const handleProceed = () => {
    if (items.length === 0) {
      toast({
        variant: "destructive",
        title: "Cart is empty",
        description: "Please add items to your cart before proceeding.",
      });
      return;
    }

    navigate("/checkout/shipping");
  };

  const handleCancel = async () => {
    setIsLoading(true);
    try {
      await clearCart();
      navigate("/catalog");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to clear cart. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-4xl py-8">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-semibold mb-4">Sample Order</h1>
          <Card className="p-6">
            <div className="space-y-6">
              {items.map((item) => (
                <ProductListItem
                  key={item.id}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeItem}
                />
              ))}
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="space-y-6">
            <ShippingCountrySelect
              selectedCountry={selectedCountry}
              onCountryChange={setSelectedCountry}
            />
            <OrderSummary
              subtotal={subtotal}
              shippingCost={shippingCost}
              total={total}
            />
            <ActionButtons
              isLoading={isLoading}
              onCancel={handleCancel}
              onProceed={handleProceed}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}