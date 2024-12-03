import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { OrderConfirmationCard } from "@/components/checkout/success/OrderConfirmationCard";
import { CustomerInformation } from "@/components/checkout/success/CustomerInformation";
import { OrderSummaryDetails } from "@/components/checkout/success/OrderSummaryDetails";
import { NavigationMenu } from "@/components/NavigationMenu";

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const orderDetails = location.state?.orderDetails;

  useEffect(() => {
    if (!orderDetails) {
      navigate('/catalog');
    }
  }, [orderDetails, navigate]);

  if (!orderDetails) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu />
      <main className="md:pl-64 w-full">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="space-y-8">
            <OrderConfirmationCard />
            
            <div className="bg-white shadow-sm rounded-lg border border-gray-200">
              <div className="p-6 space-y-6">
                <CustomerInformation orderDetails={orderDetails} />
                <OrderSummaryDetails orderDetails={orderDetails} />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;