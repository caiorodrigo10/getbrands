import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();

  useEffect(() => {
    clearCart();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-sm text-center">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your order. We'll send you a confirmation email shortly.
        </p>
        <Button
          onClick={() => navigate("/")}
          className="w-full"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default Success;