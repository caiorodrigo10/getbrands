import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useShippingCalculation } from "@/hooks/useShippingCalculation";
import { ProductSearch } from "@/components/ProductSearch";
import { ProductListItem } from "@/components/sample-order/ProductListItem";
import { OrderSummary } from "@/components/sample-order/OrderSummary";
import { ShippingCountrySelect } from "@/components/sample-order/ShippingCountrySelect";
import { ActionButtons } from "@/components/sample-order/ActionButtons";

const PedidoAmostra = () => {
  const navigate = useNavigate();
  const [selectedCountry] = useState("USA");
  const { items, updateQuantity, removeItem } = useCart();

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  
  const { data: shippingCost, isError } = useShippingCalculation(
    selectedCountry,
    totalItems
  );

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, Math.max(1, newQuantity));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.from_price * item.quantity), 0);
  };

  const handleProceedToShipping = () => {
    if (selectedCountry && items.length > 0) {
      navigate("/checkout/shipping");
    }
  };

  const subtotal = calculateSubtotal();

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-4 space-y-6">
      <div className="flex-1">
        <ProductSearch addToCart />
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <ProductListItem
            key={item.id}
            item={item}
            onQuantityChange={handleQuantityChange}
            onRemove={removeItem}
          />
        ))}
      </div>

      <div className="flex justify-between items-start gap-6">
        <ShippingCountrySelect selectedCountry={selectedCountry} />
        <OrderSummary 
          subtotal={subtotal}
          shippingCost={shippingCost || 0}
        />
      </div>

      <ActionButtons
        onProceed={handleProceedToShipping}
        disabled={!selectedCountry || items.length === 0}
      />
    </div>
  );
};

export default PedidoAmostra;