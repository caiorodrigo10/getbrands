import { Product } from "@/types/product";
import ReactMarkdown from "react-markdown";

interface ProductBenefitsProps {
  product: Product;
}

export const ProductBenefits = ({ product }: ProductBenefitsProps) => {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">Product Description</h2>
      <div className="prose prose-lg max-w-none">
        <ReactMarkdown>{product.description || 'No description available.'}</ReactMarkdown>
      </div>
    </div>
  );
};