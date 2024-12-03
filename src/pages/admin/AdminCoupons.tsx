import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CouponForm } from "@/components/admin/coupons/CouponForm";
import { CouponList } from "@/components/admin/coupons/CouponList";
import { useToast } from "@/components/ui/use-toast";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const { toast } = useToast();

  const loadCoupons = async () => {
    try {
      const { data, error } = await supabase
        .from('coupons')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setCoupons(data || []);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to load coupons",
      });
    }
  };

  useEffect(() => {
    loadCoupons();
  }, []);

  return (
    <div className="container mx-auto py-8">
      <CouponForm onCouponCreated={loadCoupons} />
      <CouponList coupons={coupons} onCouponUpdated={loadCoupons} />
    </div>
  );
};

export default AdminCoupons;