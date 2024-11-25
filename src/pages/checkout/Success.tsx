import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/NavigationMenu";
import { CheckCircle } from "lucide-react";
import Confetti from "react-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const Success = () => {
  const [searchParams] = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [orderDetails, setOrderDetails] = useState<any>(null);
  const [showConfetti, setShowConfetti] = useState(true);
  const { toast } = useToast();
  const sessionId = searchParams.get("session_id");

  useEffect(() => {
    const getOrderDetails = async () => {
      if (!sessionId) {
        setIsLoading(false);
        return;
      }

      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        const { data, error } = await supabase.functions.invoke('get-order-details', {
          body: { sessionId }
        });

        if (error) throw error;

        setOrderDetails(data);
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
  }, [sessionId, toast]);

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

  if (!sessionId || !orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationMenu />
        <main className="md:pl-64 w-full">
          <div className="max-w-3xl mx-auto px-4 py-8">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>No Order Found</CardTitle>
                <CardDescription>
                  We couldn't find any order details. Please check your order history or contact support.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
                  Return to Dashboard
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
        <div className="max-w-3xl mx-auto px-4 py-8">
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader className="text-center pb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-700">Order Confirmed!</CardTitle>
              <CardDescription className="text-green-600">
                Thank you for your order. We've received your payment and will process your order shortly.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-green-600">
                  <p>Order ID: {orderDetails.orderId}</p>
                  <p>Amount Paid: ${(orderDetails.amount / 100).toFixed(2)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button variant="outline" onClick={() => window.location.href = "/dashboard"}>
              Return to Dashboard
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;