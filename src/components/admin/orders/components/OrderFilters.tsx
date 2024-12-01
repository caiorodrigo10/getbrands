import { Input } from "@/components/ui/input";
import OrderStatusFilters from "@/components/sample-orders/OrderStatusFilters";

interface OrderFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  showOnHold: boolean;
  setShowOnHold: (show: boolean) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export const OrderFilters = ({
  selectedStatus,
  setSelectedStatus,
  showOnHold,
  setShowOnHold,
  searchTerm,
  setSearchTerm,
}: OrderFiltersProps) => {
  return (
    <div className="space-y-4">
      <OrderStatusFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        showOnHold={showOnHold}
        setShowOnHold={setShowOnHold}
      />

      <div className="flex justify-between items-center">
        <Input
          placeholder="Buscar por nome do cliente, email ou número do pedido..."
          className="max-w-md"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
    </div>
  );
};