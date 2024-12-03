import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export const CouponForm = ({ onCouponCreated }: { onCouponCreated: () => void }) => {
  const [code, setCode] = useState("");
  const [discountValue, setDiscountValue] = useState("");
  const [discountType, setDiscountType] = useState<"fixed" | "percentage">("fixed");
  const [validUntil, setValidUntil] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const createCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validate percentage is between 0 and 100
      if (discountType === "percentage" && (Number(discountValue) < 0 || Number(discountValue) > 100)) {
        throw new Error("Percentage must be between 0 and 100");
      }

      const { error } = await supabase
        .from('coupons')
        .insert([
          {
            code: code.toUpperCase(),
            discount_value: Number(discountValue),
            discount_type: discountType,
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
      setDiscountValue("");
      setValidUntil("");
      
      // Reload coupons
      onCouponCreated();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error.message || "Failed to create coupon",
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
            <label className="block text-sm font-medium mb-1">Discount Type</label>
            <Select
              value={discountType}
              onValueChange={(value: "fixed" | "percentage") => setDiscountType(value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select discount type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="fixed">Fixed Amount ($)</SelectItem>
                <SelectItem value="percentage">Percentage (%)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">
              {discountType === "fixed" ? "Discount Amount ($)" : "Discount Percentage (%)"}
            </label>
            <Input
              type="number"
              value={discountValue}
              onChange={(e) => setDiscountValue(e.target.value)}
              placeholder={discountType === "fixed" ? "50" : "10"}
              required
              min="0"
              max={discountType === "percentage" ? "100" : undefined}
              step={discountType === "fixed" ? "0.01" : "1"}
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