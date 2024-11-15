import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { useEffect } from "react";
import Confetti from 'react-confetti';
import { useWindowSize } from "@/hooks/useWindowSize";

interface LocationState {
  product?: {
    name?: string;
    image_url?: string | null;
  };
  project?: {
    name?: string;
  };
}

const ProductSelectedSuccess = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as LocationState;
  const { width, height } = useWindowSize();

  useEffect(() => {
    if (!location.state) {
      navigate("/catalogo");
    }
  }, [location.state, navigate]);

  const handleGoToProducts = () => {
    navigate("/produtos", { state: { fromProductSelection: true } });
  };

  if (!state) return null;

  return (
    <div className="flex min-h-screen bg-background">
      <Confetti
        width={width}
        height={height}
        recycle={false}
        numberOfPieces={500}
        gravity={0.2}
      />
      <main className="flex-1 p-8">
        <Card className="max-w-2xl mx-auto p-8 space-y-8 animate-fade-in shadow-lg">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <CheckCircle2 className="h-16 w-16 text-green-500 animate-scale-in" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">
              Product Successfully Selected!
            </h1>
            <p className="text-gray-600 max-w-md mx-auto">
              Your product has been sent to our team for processing.
              We'll update its status as soon as it's ready.
            </p>
          </div>

          <div className="flex items-center space-x-6 bg-gray-50 rounded-lg p-6">
            <img
              src={state.product?.image_url || "/placeholder.svg"}
              alt={state.product?.name || "Product"}
              className="w-24 h-24 object-cover rounded-lg"
            />
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{state.product?.name || "Product"}</h3>
              {state.project?.name && (
                <p className="text-sm text-gray-600">
                  Added to project: <span className="font-medium">{state.project.name}</span>
                </p>
              )}
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
              onClick={handleGoToProducts}
            >
              Go to My Products
            </Button>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default ProductSelectedSuccess;