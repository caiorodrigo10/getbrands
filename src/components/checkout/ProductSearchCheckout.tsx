import { useState, useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/integrations/supabase/client";
import { Product } from "@/types/product";
import { useToast } from "@/components/ui/use-toast";

interface ProductsResponse {
  data: Product[];
  error: any;
}

interface ProductSearchCheckoutProps {
  addToCart?: boolean;
  onSelectProduct?: (product: Product) => void;
}

export const ProductSearchCheckout = ({ addToCart, onSelectProduct }: ProductSearchCheckoutProps) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const { addItem } = useCart();
  const { toast } = useToast();
  const searchRef = useRef<HTMLDivElement>(null);

  const productsQuery = useQuery({
    queryKey: ["checkout-products"], // Using a different query key for checkout
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .order("name");
      return { data, error } as ProductsResponse;
    }
  });

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Handle loading and error states
  if (productsQuery.isLoading) {
    return <div>Loading...</div>;
  }

  if (productsQuery.error) {
    return <div>Error loading products</div>;
  }

  const products = productsQuery.data?.data || [];

  // Show all products when the dropdown is open and no query,
  // otherwise filter by the query
  const filteredProducts = open
    ? query
      ? products.filter(product =>
          product.name.toLowerCase().includes(query.toLowerCase())
        )
      : products
    : [];

  const handleSelect = async (product: Product) => {
    if (addToCart) {
      try {
        await addItem(product);
        setOpen(false);
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to add product to cart. Please try again.",
        });
      }
    }
    if (onSelectProduct) {
      onSelectProduct(product);
      setOpen(false);
    }
  };

  return (
    <div ref={searchRef} className="relative w-full">
      <Command className="relative z-50 overflow-visible bg-white">
        <div className="flex items-center border rounded-md px-3">
          <Search className="h-4 w-4 shrink-0 opacity-50" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setOpen(true)}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Search products..."
          />
        </div>
        {open && (
          <div className="absolute top-full z-50 w-full rounded-md border bg-white shadow-md mt-2">
            <Command.List className="max-h-[300px] overflow-y-auto p-2">
              {filteredProducts.length === 0 && (
                <div className="py-6 text-center text-sm">No products found.</div>
              )}
              {filteredProducts.map((product) => (
                <Command.Item
                  key={product.id}
                  value={product.name}
                  onSelect={() => handleSelect(product)}
                  className="flex items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent cursor-pointer"
                >
                  {product.image_url && (
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="h-8 w-8 object-cover rounded"
                    />
                  )}
                  <span>{product.name}</span>
                </Command.Item>
              ))}
            </Command.List>
          </div>
        )}
      </Command>
    </div>
  );
};

export default ProductSearchCheckout;
