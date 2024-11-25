import { Product } from "@/types/product";
import ReactMarkdown from "react-markdown";

interface ProductBenefitsProps {
  product: Product;
}

export const ProductBenefits = ({ product }: ProductBenefitsProps) => {
  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{product.description || 'No description available.'}</ReactMarkdown>
          </div>
        </div>
        
        <div className="hidden lg:block w-[30%]" />
      </div>
    </div>
  );
};