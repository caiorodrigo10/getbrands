import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";

interface LocationState {
  product: {
    name: string;
    image_url: string | null;
  };
  project: {
    name: string;
  };
}

const ProductSelectedSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { product, project } = (location.state as LocationState) || {
    product: { name: "", image_url: null },
    project: { name: "" },
  };

  useEffect(() => {
    if (!location.state) {
      navigate("/catalogo");
    }
  }, [location.state, navigate]);

  if (!location.state) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full p-8 space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <CheckCircle2 className="h-16 w-16 text-green-500" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900">
            Product Successfully Selected!
          </h1>
          <p className="text-gray-600 max-w-md mx-auto">
            Your product has been sent to our team for processing. We'll update its
            status as soon as it's ready.
          </p>
        </div>

        <div className="flex items-center space-x-6 bg-gray-50 rounded-lg p-6">
          <img
            src={product.image_url || "/placeholder.svg"}
            alt={product.name}
            className="w-24 h-24 object-cover rounded-lg"
          />
          <div className="space-y-2">
            <h3 className="font-semibold text-lg">{product.name}</h3>
            <p className="text-sm text-gray-600">
              Added to project: <span className="font-medium">{project.name}</span>
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
          <Button
            variant="outline"
            className="flex-1 max-w-[200px]"
            onClick={() => navigate("/catalogo")}
          >
            Continue Selecting Products
          </Button>
          <Button
            className="flex-1 max-w-[200px]"
            onClick={() => navigate("/produtos")}
          >
            Go to My Products
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default ProductSelectedSuccess;