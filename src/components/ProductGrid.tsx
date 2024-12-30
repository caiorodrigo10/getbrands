import ProductCard from "./ProductCard";
import { Product } from "@/types/product";
import { useSearchParams } from "react-router-dom";

interface ProductGridProps {
  products: Product[];
}

const ProductGrid = ({ products }: ProductGridProps) => {
  const [searchParams] = useSearchParams();
  const categories = searchParams.get("categories");
  
  // Debug logs for category filtering
  console.log('URL categories parameter:', categories);
  console.log('All available products:', products);
  
  const filteredProducts = categories 
    ? products.filter(product => {
        const selectedCategories = categories
          .split(",")
          .map(cat => cat.trim().toLowerCase());
          
        // Debug logs for category comparison
        console.log('Product being checked:', {
          name: product.name,
          category: product.category,
          lowercaseCategory: product.category?.toLowerCase()
        });
        console.log('Selected categories (lowercase):', selectedCategories);
        
        const isIncluded = selectedCategories.includes(product.category?.toLowerCase() || '');
        console.log('Is product included?', isIncluded);
        
        return isIncluded;
      })
    : products;

  // Debug log for filtered results
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