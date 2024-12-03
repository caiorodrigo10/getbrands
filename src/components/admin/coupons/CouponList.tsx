import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface Coupon {
  id: string;
  code: string;
  discount_amount: number;
  valid_until: string | null;
  is_active: boolean;
}

interface CouponListProps {
  coupons: Coupon[];
  onCouponUpdated: () => void;
}

export const CouponList = ({ coupons, onCouponUpdated }: CouponListProps) => {
  const { toast } = useToast();

  const toggleCouponStatus = async (id: string, currentStatus: boolean) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !currentStatus })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon status updated",
      });

      onCouponUpdated();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update coupon status",
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Active Coupons</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2">Code</th>
                <th className="text-left p-2">Discount</th>
                <th className="text-left p-2">Valid Until</th>
                <th className="text-left p-2">Status</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coupons.map((coupon) => (
                <tr key={coupon.id} className="border-b">
                  <td className="p-2">{coupon.code}</td>
                  <td className="p-2">${coupon.discount_amount}</td>
                  <td className="p-2">
                    {coupon.valid_until 
                      ? format(new Date(coupon.valid_until), 'PPP')
                      : 'No expiration'
                    }
                  </td>
                  <td className="p-2">
                    <span className={`px-2 py-1 rounded text-sm ${
                      coupon.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {coupon.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleCouponStatus(coupon.id, coupon.is_active)}
                    >
                      {coupon.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
};