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

interface OrderProduct {
  name: string;
  id: string;
  from_price: number;
}

interface OrderSummary {
  id: string;
  created_at: string;
  shipping_address: string;
  shipping_city: string;
  shipping_state: string;
  shipping_zip: string;
  product: OrderProduct;
}

const Success = () => {
  const navigate = useNavigate();
  const { clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const [orderDetails, setOrderDetails] = useState<OrderSummary | null>(null);
  const shippingCost = 4.50;

  useEffect(() => {
    const fetchOrderDetails = async () => {
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
            product:products (
              name,
              id,
              from_price
            )
          `)
          .eq('user_id', user?.id)
          .order('created_at', { ascending: false })
          .limit(1)
          .single();

        if (error) throw error;
        
        if (data) {
          setOrderDetails(data as OrderSummary);
        }
      } catch (error) {
        console.error('Error fetching order details:', error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load order details.",
        });
      }
    };

    if (user) {
      fetchOrderDetails();
    }
    clearCart();
  }, [user]);

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
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-xl">Order Summary</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Order #{orderDetails.id.slice(0, 8)}
                  </p>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium mb-4">Product Details</h3>
                  <div className="flex items-start gap-4 bg-muted/50 p-4 rounded-lg">
                    <Package className="h-12 w-12 text-muted-foreground" />
                    <div>
                      <h4 className="font-medium">{orderDetails.product.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        SKU: {orderDetails.product.id.slice(0, 8)}
                      </p>
                      <p className="text-sm mt-2">
                        1 x {formatCurrency(orderDetails.product.from_price)}
                      </p>
                    </div>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Shipping Address</h3>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p>{orderDetails.shipping_address}</p>
                    <p>
                      {orderDetails.shipping_city}, {orderDetails.shipping_state}{" "}
                      {orderDetails.shipping_zip}
                    </p>
                    <p>United States</p>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-medium mb-4">Payment Details</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span>{formatCurrency(orderDetails.product.from_price)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span>{formatCurrency(shippingCost)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-medium">
                      <span>Total</span>
                      <span>
                        {formatCurrency(orderDetails.product.from_price + shippingCost)}
                      </span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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