import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [searchParams] = useSearchParams();
  const categories = searchParams.get("categories");
  
  // Log para debug
  console.log('URL categories:', categories);
  console.log('Available products:', products);
  
  const filteredProducts = categories 
    ? products.filter(product => {
        const selectedCategories = decodeURIComponent(categories)
          .split(",")
          .map(cat => cat.trim());
          
        // Log para debug
        console.log('Comparing product category:', product.category);
        console.log('With selected categories:', selectedCategories);
        
        return selectedCategories.includes(product.category);
      })
    : products;

  // Log para debug
  console.log('Filtered products:', filteredProducts);

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