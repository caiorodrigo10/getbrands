import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import Sidebar from "@/components/Sidebar";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import OrderDetails from "@/components/checkout/OrderDetails";
import OrderSummary from "@/components/checkout/OrderSummary";

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetails = async () => {
      if (!user) return;

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
            sample_request_products (
              product:products (
                name,
                id,
                from_price,
                image_url
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
          clearCart();
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
  }, [user, navigate, toast, clearCart]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-3xl mx-auto">
            <div className="flex items-center justify-center p-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="max-w-3xl mx-auto">
          <Card className="mb-8 border-green-200 bg-green-50">
            <CardHeader className="text-center pb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl mb-2">Payment Successful!</CardTitle>
              <p className="text-muted-foreground">
                Thank you for your order. We'll send you a confirmation email shortly.
              </p>
            </CardHeader>
          </Card>

          {orderDetails && (
            <>
              <OrderDetails orderDetails={orderDetails} />
              <OrderSummary orderDetails={orderDetails} />
            </>
          )}

          <div className="mt-8 flex justify-between">
            <Button
              variant="outline"
              onClick={() => navigate("/sample-orders")}
              className="px-6"
            >
              View All Orders
            </Button>
            <Button
              onClick={() => navigate("/catalogo")}
              className="px-6 bg-primary hover:bg-primary-dark"
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