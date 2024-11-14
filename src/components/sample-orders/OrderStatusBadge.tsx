import { Badge } from "@/components/ui/badge";

interface OrderStatusBadgeProps {
  status: string;
}

const OrderStatusBadge = ({ status }: OrderStatusBadgeProps) => {
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "canceled":
        return "bg-red-100 text-red-800";
      case "shipped":
        return "bg-blue-100 text-blue-800";
      case "processing":
        return "bg-yellow-100 text-yellow-800";
      case "pending":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatStatus = (status: string) => {
    return status?.toUpperCase() || "PENDING";
  };

  return (
    <Badge className={getStatusColor(status)}>
      {formatStatus(status)}
    </Badge>
  );
};

export default OrderStatusBadge;