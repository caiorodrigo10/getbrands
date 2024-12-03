import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/components/ui/use-toast";

interface CreateSampleRequestParams {
  product_id: string;
  user_id: string;
  quantity: number;
  discount_amount?: number;
}

interface CreateOrderParams {
  user_id: string;
  total: number;
  discount_amount?: number;
}

export const PaymentForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();

  const [discountAmount, setDiscountAmount] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const orderData: CreateOrderParams = {
        user_id: user?.id || "",
        total: 100, // Example total
        discount_amount: discountAmount,
      };
      
      // Logic to create order with supabase here

      toast({
        title: "Success",
        description: "Order created successfully",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to create order",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="number"
        placeholder="Discount Amount"
        value={discountAmount || ""}
        onChange={(e) => setDiscountAmount(Number(e.target.value))}
      />
      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Processing..." : "Submit Payment"}
      </Button>
    </form>
  );
};