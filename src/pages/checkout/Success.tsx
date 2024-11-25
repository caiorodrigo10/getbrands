import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { NavigationMenu } from "@/components/NavigationMenu";
import { CheckCircle, Package, Truck } from "lucide-react";
import Confetti from "react-confetti";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import { formatCurrency } from "@/lib/utils";

const Success = () => {
  const [searchParams] = useSearchParams();
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
              product:products(*)
            )
          `)
          .eq('id', orderId)
          .single();

        if (error) throw error;

        // Calculate total from products
        const total = data.products.reduce((sum: number, item: any) => {
          return sum + (item.product.from_price || 0);
        }, 0);

        // Calculate shipping based on number of items
        const shippingCost = 4.50 + Math.max(0, data.products.length - 1) * 2;

        setOrderDetails({
          orderId: data.id,
          amount: total + shippingCost,
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
          shippingCost,
          subtotal: total
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
        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
          <Card className="border-green-200 bg-green-50">
            <CardHeader className="text-center pb-6">
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <CardTitle className="text-2xl text-green-700">Order Confirmed!</CardTitle>
              <CardDescription className="text-green-600">
                Thank you for your order. We've received your payment and will process your order shortly.
              </CardDescription>
            </CardHeader>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Order Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Customer Information</h4>
                  <p className="text-sm text-muted-foreground">
                    {orderDetails.customer.firstName} {orderDetails.customer.lastName}
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Shipping Address</h4>
                  <div className="text-sm text-muted-foreground">
                    <p>{orderDetails.shippingAddress.address}</p>
                    <p>
                      {orderDetails.shippingAddress.city}, {orderDetails.shippingAddress.state}{" "}
                      {orderDetails.shippingAddress.zip}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">Order Summary</h4>
                <div className="space-y-4">
                  {orderDetails.products.map((item: any) => (
                    <div key={item.product.id} className="flex items-start gap-4 p-4 bg-muted/50 rounded-lg">
                      <div className="h-16 w-16 rounded-md overflow-hidden flex-shrink-0">
                        <img
                          src={item.product.image_url || "/placeholder.svg"}
                          alt={item.product.name}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="font-medium">{item.product.name}</h5>
                        <p className="text-sm text-muted-foreground mt-1">
                          {formatCurrency(item.product.from_price)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(orderDetails.subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>{formatCurrency(orderDetails.shippingCost)}</span>
                  </div>
                  <div className="flex justify-between font-medium pt-4 border-t">
                    <span>Total</span>
                    <span>{formatCurrency(orderDetails.amount)}</span>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center pt-6 border-t">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Package className="h-4 w-4" />
                  <span>Order #{orderDetails.orderId.slice(0, 8)}</span>
                </div>
                {orderDetails.status === 'shipped' && (
                  <div className="flex items-center gap-2 text-sm">
                    <Truck className="h-4 w-4" />
                    <span>Tracking: {orderDetails.trackingNumber}</span>
                  </div>
                )}
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