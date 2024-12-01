import { Routes, Route, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { ChevronLeft, CheckCircle, Truck, CreditCard } from "lucide-react";
import PedidoAmostra from "../PedidoAmostra";
import Shipping from "./Shipping";
import Payment from "./Payment";
import { NavigationMenu } from "@/components/NavigationMenu";
import { CartProvider } from "@/contexts/CartContext";

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
    if (currentStep === 0) {
      navigate("/catalog");
    } else {
      const prevStep = steps[currentStep - 1];
      if (prevStep) {
        navigate(prevStep.path);
      }
    }
  };

  // Determine which component to render based on the current path
  const renderCheckoutStep = () => {
    const path = location.pathname;
    if (path.includes("/confirmation")) return <PedidoAmostra />;
    if (path.includes("/shipping")) return <Shipping />;
    if (path.includes("/payment")) return <Payment />;
    if (path.includes("/points")) return <PedidoAmostra />;
    return <Navigate to="/checkout/confirmation" replace />;
  };

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <main className="flex-1 md:pl-64 w-full mt-4 md:mt-0">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-8">
          <div className="mb-4 sm:mb-8">
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
                      <span className="text-sm font-medium hidden sm:inline">
                        {step.name}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="bg-card rounded-lg border border-border/50 shadow-sm p-4 md:p-6 lg:p-8">
            <CartProvider>
              {renderCheckoutStep()}
            </CartProvider>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Checkout;