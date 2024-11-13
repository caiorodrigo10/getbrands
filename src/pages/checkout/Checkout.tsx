import { useState } from "react";
import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import CartReview from "./CartReview";
import Shipping from "./Shipping";
import Payment from "./Payment";
import Sidebar from "@/components/Sidebar";

const steps = [
  { id: "review", name: "Cart", path: "/checkout/review" },
  { id: "shipping", name: "Shipping", path: "/checkout/shipping" },
  { id: "payment", name: "Payment", path: "/checkout/payment" },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [progress, setProgress] = useState(0);

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => location.pathname.includes(step.id));
  };

  const currentStep = getCurrentStepIndex();

  const goBack = () => {
    const prevStep = steps[currentStep - 1];
    if (prevStep) {
      navigate(prevStep.path);
    } else {
      navigate("/pedido-amostra");
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="max-w-3xl mx-auto px-4 py-8">
          <div className="mb-8">
            <Button
              variant="ghost"
              size="sm"
              className="mb-4"
              onClick={goBack}
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
            
            <div className="space-y-4">
              <Progress value={(currentStep / (steps.length - 1)) * 100} />
              <div className="flex justify-between">
                {steps.map((step, index) => (
                  <span
                    key={step.id}
                    className={`text-sm ${
                      index <= currentStep ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    {step.name}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <Routes>
            <Route index element={<Navigate to="/checkout/review" replace />} />
            <Route path="review" element={<CartReview />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Checkout;