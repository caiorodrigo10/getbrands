import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CheckCircle, Package } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { formatCurrency } from "@/lib/utils";
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
            sample_request_products (
              product:products (
                name,
                id,
                from_price
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
    clearCart();
  }, [user, navigate, toast, clearCart]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="max-w-3xl mx-auto">
            <Card>
              <CardContent className="flex items-center justify-center p-8">
                <p>Loading order details...</p>
              </CardContent>
            </Card>
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
          <Card className="mb-8">
            <CardHeader className="text-center">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl">Payment Successful!</CardTitle>
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
            >
              View All Orders
            </Button>
            <Button
              onClick={() => navigate("/catalogo")}
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