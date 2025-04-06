
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
  const [formKey] = useState(Date.now()); // Add a key to force re-render if needed
  
  const form = useShippingForm();

  useEffect(() => {
    trackCheckoutStep(2, items);
    console.log("Shipping form initialized");
    
    // Check if the form fields are correctly populated
    const values = form.getValues();
    console.log("Form values on mount:", values);
    
    // Check localStorage contents
    const keys = ['firstName', 'lastName', 'shipping_address', 'shipping_city', 'shipping_state', 'shipping_zip', 'addressSaved'];
    const storageData = keys.reduce((acc, key) => {
      acc[key] = localStorage.getItem(key);
      return acc;
    }, {} as Record<string, string | null>);
    
    console.log("LocalStorage contents:", storageData);
  }, [form, items]);

  const handleCancel = () => {
    navigate("/checkout/cart");
  };

  const handleContinue = () => {
    // Validate form before navigating
    const values = form.getValues();
    console.log("Form values on continue:", values);
    
    // Check if address is saved in localStorage
    const isAddressSaved = localStorage.getItem('addressSaved') === 'true';
    console.log("Is address saved according to localStorage:", isAddressSaved);
    
    if (!isAddressSaved) {
      toast({
        variant: "destructive",
        title: "Address not saved",
        description: "Please save your address before continuing to payment."
      });
      return;
    }
    
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
