import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Card } from "@/components/ui/card";
import { ShippingForm } from "@/components/checkout/ShippingForm";
import { trackCheckoutStep } from "@/lib/analytics/ecommerce";

const Shipping = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { items } = useCart();

  useEffect(() => {
    trackCheckoutStep(2, "Shipping Information", items);
  }, [items]);

  const handleSubmit = async (formData: any) => {
    try {
      if (!user) {
        toast.error("You must be logged in to continue");
        return;
      }

      const { error } = await supabase
        .from('profiles')
        .update({
          shipping_address_street: formData.street,
          shipping_address_street2: formData.street2,
          shipping_address_city: formData.city,
          shipping_address_state: formData.state,
          shipping_address_zip: formData.zip,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;

      navigate("/checkout/payment");
    } catch (error) {
      console.error('Error saving shipping info:', error);
      toast.error("Failed to save shipping information");
    }
  };

  return (
    <div className="space-y-4">
      <Card className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="p-2 sm:p-4 border-b">
          <h2 className="text-base sm:text-lg font-medium">Shipping Information</h2>
        </div>
        
        <div className="p-2 sm:p-4">
          <ShippingForm onSubmit={handleSubmit} />
        </div>
      </Card>

      <div className="fixed bottom-0 left-0 right-0 p-3 bg-background border-t sm:relative sm:border-0 sm:p-0 sm:bg-transparent">
        <Button
          onClick={() => navigate(-1)}
          variant="outline"
          className="w-full sm:w-auto h-9 sm:h-11 text-sm sm:text-base"
        >
          Back to cart
        </Button>
      </div>
      
      {/* Add padding at the bottom on mobile to account for fixed button */}
      <div className="h-16 sm:h-0"></div>
    </div>
  );
};

export default Shipping;