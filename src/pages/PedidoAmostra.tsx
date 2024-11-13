import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2, Plus, Minus } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product";
import { useNavigate } from "react-router-dom";

interface CartItem extends Product {
  quantity: number;
}

const SHIPPING_RATES = {
  US: 10,
  BR: 15,
  PT: 20,
};

const PedidoAmostra = () => {
  const navigate = useNavigate();
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  const handleQuantityChange = (itemId: number, newQuantity: number) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, newQuantity) }
          : item
      )
    );
  };

  const removeFromCart = (itemId: number) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.fromPrice * item.quantity), 0);
  };

  const getShippingCost = () => {
    return selectedCountry ? SHIPPING_RATES[selectedCountry as keyof typeof SHIPPING_RATES] || 0 : 0;
  };

  const calculateTotal = () => {
    return calculateSubtotal() + getShippingCost();
  };

  const handleProceedToShipping = () => {
    if (selectedCountry && cartItems.length > 0) {
      navigate("/pedido-amostra/envio");
    }
  };

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pedido de amostras</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Encontre seus produtos..."
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          <Button className="bg-primary hover:bg-primary-dark">
            Adicionar Produto
          </Button>
        </div>

        <div className="space-y-4 mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">${item.fromPrice.toFixed(2)} por unidade</p>
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
                  <span className="w-12 text-center">{item.quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <p className="font-semibold text-gray-900 w-24 text-right">
                  ${(item.fromPrice * item.quantity).toFixed(2)}
                </p>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  <Trash2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-start mb-8">
          <div className="w-72">
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
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-semibold">${calculateSubtotal().toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Frete:</span>
              <span className="font-semibold">${getShippingCost().toFixed(2)}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between">
                <span className="font-semibold">Total:</span>
                <span className="font-semibold">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            onClick={handleProceedToShipping}
            className="bg-primary hover:bg-primary-dark"
            disabled={!selectedCountry || cartItems.length === 0}
          >
            Prosseguir para Envio
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PedidoAmostra;