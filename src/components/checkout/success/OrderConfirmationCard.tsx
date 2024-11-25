import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export const OrderConfirmationCard = () => {
  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader className="text-center pb-6">
        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <CardTitle className="text-2xl text-green-700">Order Confirmed!</CardTitle>
        <CardDescription className="text-green-600">
          Thank you for your order. We've received your payment and will process your order shortly.
        </CardDescription>
      </CardHeader>
    </Card>
  );
};