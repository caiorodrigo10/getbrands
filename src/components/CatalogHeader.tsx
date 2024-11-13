import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

const CatalogHeader = () => {
  return (
    <div className="mb-8 pt-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">Seja bem-vindo, Caio Rodrigo!</h1>
          <p className="text-gray-600 mt-2">Escolha um produto para customizar</p>
        </div>
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar produtos..."
            className="pl-10 bg-white border-gray-200"
          />
        </div>
      </div>
    </div>
  );
};

export default CatalogHeader;