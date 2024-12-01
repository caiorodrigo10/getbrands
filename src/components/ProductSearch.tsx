import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";
import { useState, useRef, useEffect } from "react";

interface ProductSearchResult {
  products: Product[];
}

interface ProductSearchProps {
  onSelectProduct?: (product: Product) => void;
}

export const ProductSearch = ({ onSelectProduct }: ProductSearchProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  const productsQuery = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*');

      if (error) throw error;
      return { products: data as Product[] };
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (!productsQuery.data) return;
    
    const filtered = productsQuery.data.products.filter(product =>
      product.name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredProducts(filtered);
  }, [query, productsQuery.data]);

  const handleSelect = async (product: Product) => {
    if (onSelectProduct) {
      onSelectProduct(product);
      setOpen(false);
    }
  };

  if (productsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (productsQuery.isError) {
    return <div>Error loading products</div>;
  }

  return (
    <div ref={searchRef} className="relative w-full">
      <Command className="rounded-lg border shadow-md">
        <div className="flex items-center border-b px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            className="flex h-10 w-full rounded-md bg-transparent py-3 px-2 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search products..."
          />
        </div>
        {open && (
          <ul className="max-h-[300px] overflow-y-auto p-2">
            {filteredProducts.map((product) => (
              <li
                key={product.id}
                onClick={() => handleSelect(product)}
                className="cursor-pointer rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
              >
                {product.name}
              </li>
            ))}
          </ul>
        )}
      </Command>
    </div>
  );
};