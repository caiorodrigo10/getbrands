import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Trash2 } from "lucide-react";
import { useState } from "react";
import { Product } from "@/types/product";

const PedidoAmostra = () => {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [cartItems, setCartItems] = useState<Product[]>([]);

  return (
    <div className="p-8 bg-white min-h-screen">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Pedido de amostras</h1>
        
        <div className="flex items-center gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Encontre seus produtos..."
              className="pl-10 bg-white border-gray-200"
            />
          </div>
          <Button className="bg-primary hover:bg-primary-dark">
            Selecionar todos
          </Button>
        </div>

        <div className="mb-8">
          {cartItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 object-contain" />
                <div>
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600">{item.category}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700">
                <Trash2 className="h-5 w-5" />
              </Button>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center mb-8">
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
          <Button className="bg-primary hover:bg-primary-dark">
            Próxima etapa
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PedidoAmostra;