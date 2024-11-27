import { Product } from "@/types/product";
import ReactMarkdown from "react-markdown";
import parse from 'html-react-parser';

interface ProductBenefitsProps {
  product: Product;
}

export const ProductBenefits = ({ product }: ProductBenefitsProps) => {
  const isHTML = (str: string) => {
    if (!str) return false;
    const doc = new DOMParser().parseFromString(str, 'text/html');
    return Array.from(doc.body.childNodes).some(node => node.nodeType === 1);
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <div className="prose prose-lg max-w-none">
            {product.description ? (
              isHTML(product.description) ? (
                parse(product.description)
              ) : (
                <ReactMarkdown>{product.description}</ReactMarkdown>
              )
            ) : (
              'No description available.'
            )}
          </div>
        </div>
        
        <div className="hidden lg:block w-[30%]" />
      </div>
    </div>
  );
};