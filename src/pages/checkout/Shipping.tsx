import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShippingForm } from "@/hooks/useShippingForm";
import { ShippingFormContainer } from "@/components/shipping/ShippingFormContainer";
import { useToast } from "@/components/ui/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { useCart } from "@/contexts/CartContext";
import { trackCheckoutStepViewed, trackCheckoutStepCompleted } from "@/lib/analytics/events/checkout";

const Shipping = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  const { items } = useCart();
  const form = useShippingForm();

  useEffect(() => {
    if (!items.length) {
      navigate("/checkout/confirmation");
      return;
    }

    const trackShippingStep = async () => {
      if (!user?.email) return;

      const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
      const shippingCost = 4.50; // Valor fixo para exemplo

      await trackCheckoutStepViewed('shipping', {
        customerEmail: user.email,
        subtotal,
        shippingCost,
        total: subtotal + shippingCost,
        products: items.map(item => ({
          product_id: item.id,
          product_name: item.name,
          quantity: item.quantity || 1,
          price: item.from_price
        }))
      });
    };

    trackShippingStep();
  }, [items, navigate, user?.email]);

  const handleCancel = () => {
    navigate("/checkout/confirmation");
  };

  const handleContinue = async () => {
    if (!user?.email) return;

    const subtotal = items.reduce((sum, item) => sum + (item.from_price * (item.quantity || 1)), 0);
    const shippingCost = 4.50; // Valor fixo para exemplo

    // Track shipping step completion
    await trackCheckoutStepCompleted('shipping', {
      customerEmail: user.email,
      subtotal,
      shippingCost,
      total: subtotal + shippingCost,
      shippingAddress: {
        address1: form.getValues().address1,
        address2: form.getValues().address2,
        city: form.getValues().city,
        state: form.getValues().state,
        zipCode: form.getValues().zipCode,
        country: 'US'
      },
      products: items.map(item => ({
        product_id: item.id,
        product_name: item.name,
        quantity: item.quantity || 1,
        price: item.from_price
      }))
    });

    navigate("/checkout/payment");
  };

  if (!user) {
    return null;
  }

  return (
    <ShippingFormContainer
      user={user}
      form={form}
      onCancel={handleCancel}
      onContinue={handleContinue}
      toast={toast}
    />
  );
};

export default Shipping;