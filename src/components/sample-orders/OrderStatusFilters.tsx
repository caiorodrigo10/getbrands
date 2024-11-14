import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface OrderStatusFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  showOnHold: boolean;
  setShowOnHold: (show: boolean) => void;
}

const OrderStatusFilters = ({
  selectedStatus,
  setSelectedStatus,
  showOnHold,
  setShowOnHold,
}: OrderStatusFiltersProps) => {
  return (
    <div className="flex flex-wrap gap-2">
      <Button
        variant={selectedStatus === "all" ? "default" : "outline"}
        onClick={() => setSelectedStatus("all")}
      >
        All
      </Button>
      <Button
        variant={selectedStatus === "pending" ? "default" : "outline"}
        onClick={() => setSelectedStatus("pending")}
      >
        Pending
      </Button>
      <Button
        variant={selectedStatus === "completed" ? "default" : "outline"}
        onClick={() => setSelectedStatus("completed")}
      >
        Completed
      </Button>
      <Button
        variant={selectedStatus === "canceled" ? "default" : "outline"}
        onClick={() => setSelectedStatus("canceled")}
      >
        Canceled
      </Button>
      <div className="flex items-center gap-2 ml-4">
        <Switch checked={showOnHold} onCheckedChange={setShowOnHold} />
        <span className="text-sm">On Hold</span>
      </div>
    </div>
  );
};

export default OrderStatusFilters;