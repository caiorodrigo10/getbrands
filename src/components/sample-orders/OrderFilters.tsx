import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface OrderFiltersProps {
  selectedStatus: string;
  setSelectedStatus: (status: string) => void;
  showOnHold: boolean;
  setShowOnHold: (show: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const OrderFilters = ({
  selectedStatus,
  setSelectedStatus,
  showOnHold,
  setShowOnHold,
  searchQuery,
  setSearchQuery,
}: OrderFiltersProps) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between gap-4">
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
          variant={selectedStatus === "processing" ? "default" : "outline"}
          onClick={() => setSelectedStatus("processing")}
        >
          Processing
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

      <div className="relative w-full sm:w-72">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
        <Input
          placeholder="Search by product or order number"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>
    </div>
  );
};

export default OrderFilters;