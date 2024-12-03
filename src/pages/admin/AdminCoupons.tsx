import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const AdminCoupons = () => {
  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [coupons, setCoupons] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
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

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('coupons')
        .insert([
          {
            code: code.toUpperCase(),
            discount_amount: Number(discountAmount),
            valid_until: validUntil ? new Date(validUntil).toISOString() : null,
            is_active: true
          }
        ]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Coupon created successfully",
      });

      // Reset form
      setCode("");
      setDiscountAmount("");
      setValidUntil("");
      
      // Reload coupons
      loadCoupons();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create coupon",
      });
    } finally {
      setIsLoading(false);
    }
  };

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

      loadCoupons();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to update coupon status",
      });
    }
  };

  // Load coupons when component mounts
  useState(() => {
    loadCoupons();
  });

  return (
    <div className="container mx-auto py-8">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Create New Coupon</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={createCoupon} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Coupon Code</label>
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="SUMMER2024"
                required
                className="uppercase"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Discount Amount ($)</label>
              <Input
                type="number"
                value={discountAmount}
                onChange={(e) => setDiscountAmount(e.target.value)}
                placeholder="50"
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Valid Until (Optional)</label>
              <Input
                type="datetime-local"
                value={validUntil}
                onChange={(e) => setValidUntil(e.target.value)}
              />
            </div>

            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Creating..." : "Create Coupon"}
            </Button>
          </form>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default AdminCoupons;