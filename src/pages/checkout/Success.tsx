import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/NavigationMenu";
import Confetti from "react-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { OrderConfirmationCard } from "@/components/checkout/success/OrderConfirmationCard";
import { CustomerInformation } from "@/components/checkout/success/CustomerInformation";
import { OrderSummaryDetails } from "@/components/checkout/success/OrderSummaryDetails";

const Success = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();
  const orderId = searchParams.get("order_id");
  const paymentIntentId = searchParams.get("payment_intent");

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!orderId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('sample_requests')
          .select(`
            *,
            products:sample_request_products(
              quantity,
              unit_price,
              product:products(*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;

        setOrderDetails({
          orderId: data.id,
          amount: data.total,
          status: data.status,
          products: data.products,
          shippingAddress: {
            address: data.shipping_address,
            city: data.shipping_city,
            state: data.shipping_state,
            zip: data.shipping_zip
          },
          customer: {
            firstName: data.first_name,
            lastName: data.last_name
          },
          paymentIntentId,
          shippingCost: data.shipping_cost || 0,
          subtotal: data.subtotal
        });
      } catch (error: any) {
        console.error('Error fetching order details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to fetch order details. Please contact support.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    getOrderDetails();

    // Cleanup confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, [orderId, paymentIntentId, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationMenu />
        <main className="md:pl-64 w-full">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!orderId || !orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationMenu />
        <main className="md:pl-64 w-full">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>No Order Found</CardTitle>
                <CardContent>
                  We couldn't find any order details. Please check your order history or contact support.
                </CardContent>
              </CardHeader>
              <CardContent>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => navigate('/')}
                >
                  Return to Home
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background relative">
      {showConfetti && <Confetti />}
      <NavigationMenu />
      <main className="md:pl-64 w-full">
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <OrderConfirmationCard />

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <CustomerInformation orderDetails={orderDetails} />
              <OrderSummaryDetails orderDetails={orderDetails} />
            </CardContent>
          </Card>

          <div className="text-center">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate('/')}
            >
              Return to Home
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;
