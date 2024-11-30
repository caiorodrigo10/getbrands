import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const ProductDetailsHeader = () => {
  const navigate = useNavigate();
  
  return (
    <Button
      onClick={() => navigate('/catalog')}
      variant="ghost"
      size="sm"
      className="hover:text-primary transition-colors -mt-4 hover:bg-transparent"
    >
      <ArrowLeft className="mr-1 h-3 w-3" />
      Back to Catalog
    </Button>
  );
};