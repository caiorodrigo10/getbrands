import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ProductSearch } from "@/components/ProductSearch";
import { useShippingCalculation } from "@/hooks/useShippingCalculation";
import { useToast } from "@/components/ui/use-toast";

const PedidoAmostra = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
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

  const calculateTotal = () => {
    return calculateSubtotal() + (shippingCost || 0);
  };

  const handleProceedToShipping = () => {
    if (selectedCountry && items.length > 0) {
      navigate("/checkout/shipping");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-0 sm:px-4 space-y-6">
      <div className="flex-1">
        <ProductSearch addToCart />
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-start gap-4 mb-4 sm:mb-0">
              <img src={item.image_url || '/placeholder.svg'} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded p-2" />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
                <p className="text-sm text-gray-600 sm:hidden mb-2">${item.from_price.toFixed(2)} per unit</p>
              </div>
            </div>
            
            {/* Mobile controls - Rearranged layout */}
            <div className="sm:hidden flex items-center justify-between w-full mt-2">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="h-3 w-3" />
                </Button>
                <span className="w-8 text-center text-sm">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="h-3 w-3" />
                </Button>
              </div>
              <p className="font-semibold text-gray-900">
                ${(item.from_price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 h-7 w-7"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Desktop controls */}
            <div className="hidden sm:flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center text-base">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9"
                  onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-semibold text-gray-900 w-20 text-right">
                ${(item.from_price * item.quantity).toFixed(2)}
              </p>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeItem(item.id)}
                className="text-red-500 hover:text-red-700 h-9 w-9"
              >
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-start gap-6">
        <div className="w-64">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Shipping Country
          </label>
          <Select value={selectedCountry} disabled>
            <SelectTrigger className="bg-white">
              <SelectValue>United States</SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="USA">United States</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="w-64 space-y-3 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Shipping:</span>
            <span className="font-semibold text-gray-900">${(shippingCost || 0).toFixed(2)}</span>
          </div>
          <div className="border-t pt-3 mt-3">
            <div className="flex justify-between">
              <span className="font-semibold text-gray-900">Total:</span>
              <span className="font-semibold text-gray-900">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <Button
          onClick={handleProceedToShipping}
          className="bg-primary hover:bg-primary-dark text-white px-6"
          disabled={!selectedCountry || items.length === 0}
        >
          Proceed to Shipping
        </Button>
      </div>
    </div>
  );
};

export default PedidoAmostra;