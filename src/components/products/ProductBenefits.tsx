import { Product } from "@/types/product";
import ReactMarkdown from "react-markdown";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface ProductBenefitsProps {
  product: Product;
}

export const ProductBenefits = ({ product }: ProductBenefitsProps) => {
  const navigate = useNavigate();

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-4">Product Description</h2>
          <div className="prose prose-lg max-w-none">
            <ReactMarkdown>{product.description || 'No description available.'}</ReactMarkdown>
          </div>
        </div>
        
        <div className="hidden md:flex w-[35%] bg-orange-100 p-4 rounded-lg flex-col items-start space-y-3">
          <h3 className="text-lg font-semibold text-orange-800">
            Want to develop this product with your brand?
          </h3>
          <p className="text-orange-700 text-sm">
            Schedule a demo and talk to our team about customizing this product for your brand.
          </p>
          <Button 
            onClick={() => navigate("/start-here")}
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            <CalendarDays className="mr-2 h-4 w-4" />
            Schedule a Demo
          </Button>
        </div>
      </div>
    </div>
  );
};