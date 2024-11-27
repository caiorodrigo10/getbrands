import { Search, X } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/types/product";
import { useCart } from "@/contexts/CartContext";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

interface ProductSearchProps {
  onSelectProduct?: (product: Product) => void;
  addToCart?: boolean;
}

export const ProductSearch = ({ onSelectProduct, addToCart = false }: ProductSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { data: productsData } = useProducts();
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { addItem } = useCart();
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current && 
        !dropdownRef.current.contains(event.target as Node) &&
        !inputRef.current?.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle both infinite and regular query results
  const products = ('pages' in productsData 
    ? productsData.pages[0]?.data 
    : productsData?.data) || [];

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelect = async (product: Product) => {
    if (addToCart) {
      try {
        await addItem(product);
        setOpen(false);
        setQuery("");
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not add product to cart.",
        });
      }
    } else if (onSelectProduct) {
      onSelectProduct(product);
      setOpen(false);
      setQuery("");
    }
  };

  return (
    <div className="relative w-full">
      <div className="relative flex items-center w-full">
        <Search className="absolute left-3 text-gray-400 h-4 w-4" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setOpen(true)}
          placeholder="Find your products"
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary/20"
        />
        {query && (
          <button
            onClick={() => {
              setQuery("");
              inputRef.current?.focus();
            }}
            className="absolute right-3 text-gray-400 hover:text-gray-600"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {open && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full bg-white rounded-lg border border-gray-200 shadow-lg max-h-[400px] overflow-y-auto"
        >
          {filteredProducts.length === 0 ? (
            <div className="p-4 text-center text-gray-500">
              No products found
            </div>
          ) : (
            <div className="p-2">
              {filteredProducts.map((product) => (
                <button
                  key={product.id}
                  onClick={() => handleSelect(product)}
                  className="w-full flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md transition-colors"
                >
                  <img
                    src={product.image_url || "/placeholder.svg"}
                    alt={product.name}
                    className="w-12 h-12 object-cover rounded-md"
                  />
                  <div className="flex-1 text-left">
                    <p className="font-medium text-gray-900">{product.name}</p>
                    <p className="text-sm text-gray-500">
                      ${product.from_price.toFixed(2)}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};