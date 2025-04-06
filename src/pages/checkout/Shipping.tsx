
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useShippingForm } from "@/hooks/useShippingForm";
import { ShippingFormContainer } from "@/components/shipping/ShippingFormContainer";
import { useToast } from "@/components/ui/use-toast";
import { useCart } from "@/contexts/CartContext";
import { trackCheckoutStep } from "@/lib/analytics/ecommerce";

const Shipping = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const { items } = useCart();
  const [formKey, setFormKey] = useState(Date.now()); // Add a key to force re-render if needed
  
  const form = useShippingForm();

  useEffect(() => {
    trackCheckoutStep(2, items);
    console.log("Shipping form initialized");
  }, [items]);

  const handleCancel = () => {
    navigate("/checkout/cart");
  };

  const handleContinue = () => {
    navigate("/checkout/payment");
  };

  if (!user) {
    return null;
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Shipping Information</h2>
        
        <ShippingFormContainer
          key={formKey}
          user={user}
          form={form}
          onCancel={handleCancel}
          onContinue={handleContinue}
          toast={toast}
        />
      </div>
    </div>
  );
};

export default Shipping;
