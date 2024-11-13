import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Minus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { ProductSearch } from "@/components/ProductSearch";

const SHIPPING_RATES = {
  US: 10,
  BR: 15,
  PT: 20,
};

const PedidoAmostra = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const { items, updateQuantity, removeItem } = useCart();

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    updateQuantity(itemId, Math.max(1, newQuantity));
  };

  const calculateSubtotal = () => {
    return items.reduce((total, item) => total + (item.from_price * item.quantity), 0);
  };

  const getShippingCost = () => {
    return selectedCountry ? SHIPPING_RATES[selectedCountry as keyof typeof SHIPPING_RATES] || 0 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const handleProceedToShipping = () => {
    if (selectedCountry && items.length > 0) {
      navigate("/checkout/shipping");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <div className="flex-1 max-w-lg">
          <ProductSearch />
        </div>
        <Button className="bg-primary hover:bg-primary-dark text-white whitespace-nowrap">
          Adicionar Produto
        </Button>
      </div>

      <div className="space-y-4 mb-6">
        {items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
            <div className="flex items-center gap-4">
              <img src={item.image_url || '/placeholder.svg'} alt={item.name} className="w-16 h-16 object-contain bg-gray-50 rounded p-2" />
              <div>
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <p className="text-sm text-gray-600">${item.from_price.toFixed(2)} por unidade</p>
              </div>
            </div>
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-12 text-center text-gray-900">{item.quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
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
                className="text-red-500 hover:text-red-700"
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
            País de envio
          </label>
          <Select value={selectedCountry} onValueChange={setSelectedCountry}>
            <SelectTrigger className="bg-white">
              <SelectValue placeholder="Selecione o país" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="BR">Brasil</SelectItem>
              <SelectItem value="US">Estados Unidos</SelectItem>
              <SelectItem value="PT">Portugal</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="w-64 space-y-3 bg-white p-4 rounded-lg shadow-sm">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal:</span>
            <span className="font-semibold text-gray-900">${calculateSubtotal().toFixed(2)}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Frete:</span>
            <span className="font-semibold text-gray-900">${getShippingCost().toFixed(2)}</span>
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
          Prosseguir para Envio
        </Button>
      </div>
    </div>
  );
};

export default PedidoAmostra;