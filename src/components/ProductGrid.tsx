import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [searchParams] = useSearchParams();
  const categories = searchParams.get("categories");
  
  const filteredProducts = categories 
    ? products.filter(product => {
        const selectedCategories = decodeURIComponent(categories).split(",");
        return selectedCategories.includes(product.category);
      })
    : products;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredProducts.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
        />
      ))}
    </div>
  );
};

export default ProductGrid;