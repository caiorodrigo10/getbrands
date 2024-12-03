import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Coupon {
  code: string;
  discount_type: "fixed" | "percentage";
  discount_value: number;
  valid_from: string | null;
  valid_until: string | null;
  is_active: boolean;
}

export const useCouponValidation = (subtotal: number) => {
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [isValidatingCoupon, setIsValidatingCoupon] = useState(false);
  const { toast } = useToast();

  const calculateDiscount = (coupon: Coupon) => {
    if (coupon.discount_type === 'percentage') {
      return (subtotal * coupon.discount_value) / 100;
    }
    return coupon.discount_value;
  };

  const validateCoupon = async () => {
    if (!couponCode.trim()) {
      toast({
        description: "Please enter a coupon code",
      });
      return;
    }

    setIsValidatingCoupon(true);
    try {
      const { data: couponData, error } = await supabase
        .from('coupons')
        .select('*')
        .eq('code', couponCode.toUpperCase())
        .eq('is_active', true)
        .single();

      if (error || !couponData) {
        toast({
          variant: "destructive",
          description: "Invalid coupon code",
        });
        setDiscountAmount(0);
        return;
      }

      const now = new Date();
      const validFrom = couponData.valid_from ? new Date(couponData.valid_from) : null;
      const validUntil = couponData.valid_until ? new Date(couponData.valid_until) : null;

      if (
        (validFrom && now < validFrom) || 
        (validUntil && now > validUntil)
      ) {
        toast({
          variant: "destructive",
          description: "This coupon has expired or is not yet valid",
        });
        setDiscountAmount(0);
        return;
      }

      const discount = calculateDiscount(couponData as Coupon);
      setDiscountAmount(discount);
      toast({
        description: "Coupon applied successfully!",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        description: "Error validating coupon",
      });
    } finally {
      setIsValidatingCoupon(false);
    }
  };

  return {
    couponCode,
    setCouponCode,
    discountAmount,
    isValidatingCoupon,
    validateCoupon
  };
};