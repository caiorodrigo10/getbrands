import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProductDetailsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      onClick={() => navigate('/catalog')}
      variant="ghost"
      className="hover:text-white hover:bg-orange-500 transition-colors"
    >
      <ArrowLeft className="mr-2 h-4 w-4" />
      Back to Catalog
    </Button>
  );
};