import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const CouponForm = ({ onCouponCreated }: { onCouponCreated: () => void }) => {
  const [code, setCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [validUntil, setValidUntil] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

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
      onCouponCreated();
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

  return (
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
  );
};