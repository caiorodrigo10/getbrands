import { Product } from "@/types/product";

interface ProductBenefitsProps {
  product: Product;
}

export const ProductBenefits = ({ product }: ProductBenefitsProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Product Description</h2>
      <div className="prose max-w-none">
        {product.description || 'No description available.'}
      </div>
    </div>
  );
};