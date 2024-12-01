import { Button } from "@/components/ui/button";
import { Plus, Minus, Trash2 } from "lucide-react";

interface ProductListItemProps {
  item: {
    id: string;
    name: string;
    image_url: string | null;
    from_price: number;
    quantity: number;
  };
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
}

export const ProductListItem = ({ item, onQuantityChange, onRemove }: ProductListItemProps) => {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white shadow-sm">
      <div className="flex items-start gap-4 mb-4 sm:mb-0">
        <img 
          src={item.image_url || '/placeholder.svg'} 
          alt={item.name} 
          className="w-16 h-16 object-contain bg-gray-50 rounded p-2" 
        />
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-gray-900 text-lg mb-1">{item.name}</h3>
          <p className="text-sm text-gray-600 sm:hidden mb-2">${item.from_price.toFixed(2)} per unit</p>
        </div>
      </div>
      
      {/* Mobile controls */}
      <div className="sm:hidden flex items-center justify-between w-full mt-2">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            <Minus className="h-3 w-3" />
          </Button>
          <span className="w-8 text-center text-sm">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
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
          onClick={() => onRemove(item.id)}
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
            onClick={() => onQuantityChange(item.id, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-8 text-center text-base">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9"
            onClick={() => onQuantityChange(item.id, item.quantity + 1)}
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
          onClick={() => onRemove(item.id)}
          className="text-red-500 hover:text-red-700 h-9 w-9"
        >
          <Trash2 className="h-5 w-5" />
        </Button>
      </div>
    </div>
  );
};