import ProductCard from "./ProductCard";
import { Product } from "@/types/product";

interface ProductGridProps {
  products: Product[];
  onRequestSample: (id: number) => void;
  onSelectProduct: (id: number) => void;
}

const ProductGrid = ({ products, onRequestSample, onSelectProduct }: ProductGridProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          onRequestSample={onRequestSample}
          onSelectProduct={onSelectProduct}
        />
      ))}
    </div>
  );
};

export default ProductGrid;