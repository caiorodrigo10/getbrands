import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Package, Truck, Clock } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import OrderDetails from "@/components/checkout/OrderDetails";
import OrderSummary from "@/components/checkout/OrderSummary";
import { NavigationMenu } from "@/components/NavigationMenu";
import Confetti from 'react-confetti';

const Success = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    // Hide confetti after 5 seconds
    const timer = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) {
        navigate('/login');
        return;
      }

      try {
        const { data, error } = await supabase
          .from('sample_requests')
          .select(`
            id,
            created_at,
            shipping_address,
            shipping_city,
            shipping_state,
            shipping_zip,
            first_name,
            last_name,
            sample_request_products (
              product:products (
                name,
                id,
                from_price,
                image_url,
                category
              )
            )
          `)
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data) {
          setOrderDetails(data);
        } else {
          toast({
            variant: "destructive",
            title: "Error",
            description: "No order found. Please try again.",
          });
          navigate('/catalogo');
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order details.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderDetails();
  }, [user, navigate, toast]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationMenu />
        <main className="p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (!orderDetails) {
    return (
      <div className="min-h-screen bg-background">
        <NavigationMenu />
        <main className="p-8">
          <div className="max-w-3xl mx-auto">
            <Card className="text-center">
              <CardHeader>
                <CardTitle>No Order Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="mb-4">We couldn't find your order details.</p>
                <Button onClick={() => navigate('/catalogo')}>
                  Return to Catalog
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && <Confetti />}
      <NavigationMenu />
      <main className="p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader className="text-center pb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Order Confirmed!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your order. We'll send you updates about your samples via email.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Order #{orderDetails.id.slice(0, 8)}
              </p>
            </CardHeader>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle>Order Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-1/2 h-0.5 bg-gray-200 -z-10" />
                <div className="flex flex-col items-center gap-2 bg-background p-2">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                    <Package className="w-4 h-4 text-white" />
                  </div>
                  <span className="text-sm font-medium">Order Placed</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-background p-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Clock className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-400">Processing</span>
                </div>
                <div className="flex flex-col items-center gap-2 bg-background p-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                    <Truck className="w-4 h-4 text-gray-400" />
                  </div>
                  <span className="text-sm text-gray-400">Shipped</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {orderDetails && (
            <>
              <OrderDetails orderDetails={orderDetails} />
              <OrderSummary orderDetails={orderDetails} />
            </>
          )}

          <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:gap-6 sm:justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/sample-orders")}
              className="w-full sm:w-auto px-6"
            >
              View All Orders
            </Button>
            <Button
              onClick={() => navigate("/catalogo")}
              className="w-full sm:w-auto px-6 bg-primary hover:bg-primary-dark"
            >
              Continue Shopping
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Success;