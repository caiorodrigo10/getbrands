import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, Truck, CreditCard } from "lucide-react";
import PedidoAmostra from "../PedidoAmostra";
import Shipping from "./Shipping";
import Payment from "./Payment";
import Sidebar from "@/components/Sidebar";

const steps = [
  { id: "confirmation", name: "Confirmation", path: "/checkout/confirmation", icon: CheckCircle },
  { id: "shipping", name: "Shipping", path: "/checkout/shipping", icon: Truck },
  { id: "payment", name: "Payment", path: "/checkout/payment", icon: CreditCard },
];

const Checkout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const getCurrentStepIndex = () => {
    return steps.findIndex(step => location.pathname.includes(step.id));
  };

  const currentStep = getCurrentStepIndex();

  const goBack = () => {
    const prevStep = steps[currentStep - 1];
    if (prevStep) {
      navigate(prevStep.path);
    } else {
      navigate("/catalogo");
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
            
            <div className="space-y-4 max-w-2xl mx-auto">
              <Progress value={(currentStep / (steps.length - 1)) * 100} />
              <div className="flex justify-between">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.id}
                      className={`flex items-center gap-2 ${
                        index <= currentStep ? "text-primary" : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <Routes>
            <Route index element={<Navigate to="/checkout/confirmation" replace />} />
            <Route path="confirmation" element={<PedidoAmostra />} />
            <Route path="shipping" element={<Shipping />} />
            <Route path="payment" element={<Payment />} />
          </Routes>
        </div>
      </main>
    </div>
  );
};

export default Checkout;