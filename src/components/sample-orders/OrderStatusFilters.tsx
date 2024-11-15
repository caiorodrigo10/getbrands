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
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      <Button
        size="sm"
        variant={selectedStatus === "all" ? "default" : "outline"}
        onClick={() => setSelectedStatus("all")}
        className="text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-9"
      >
        All
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === "pending" ? "default" : "outline"}
        onClick={() => setSelectedStatus("pending")}
        className="text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-9"
      >
        Pending
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === "processing" ? "default" : "outline"}
        onClick={() => setSelectedStatus("processing")}
        className="text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-9"
      >
        Processing
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === "shipped" ? "default" : "outline"}
        onClick={() => setSelectedStatus("shipped")}
        className="text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-9"
      >
        Shipped
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === "completed" ? "default" : "outline"}
        onClick={() => setSelectedStatus("completed")}
        className="text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-9"
      >
        Completed
      </Button>
      <Button
        size="sm"
        variant={selectedStatus === "canceled" ? "default" : "outline"}
        onClick={() => setSelectedStatus("canceled")}
        className="text-xs sm:text-sm px-2 sm:px-4 h-7 sm:h-9"
      >
        Canceled
      </Button>
      <div className="flex items-center gap-2 ml-2 sm:ml-4">
        <Switch 
          checked={showOnHold} 
          onCheckedChange={setShowOnHold}
          className="scale-75 sm:scale-100"
        />
        <span className="text-xs sm:text-sm">On Hold</span>
      </div>
    </div>
  );
};

export default OrderStatusFilters;