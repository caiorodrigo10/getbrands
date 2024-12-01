import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { trackSampleOrdersViewed } from "@/lib/analytics/pages";
import { LoadingState } from "./LoadingState";
import { SampleOrderList } from "./SampleOrderList";
import OrderStatusFilters from "@/components/sample-orders/OrderStatusFilters";
import { useSampleOrders } from "../hooks/useSampleOrders";

export const SampleOrdersContainer = () => {
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { user } = useAuth();

  const { data: ordersData, isLoading, refetch } = useSampleOrders(currentPage, selectedStatus);

  useEffect(() => {
    trackSampleOrdersViewed();
  }, []);

  if (!user) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">Please log in to view your orders.</p>
      </div>
    );
  }

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">My Sample Orders</h1>
        <p className="text-gray-600 mt-2">View and track your sample orders</p>
      </div>

      <div className="space-y-4">
        <OrderStatusFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          showOnHold={showOnHold}
          setShowOnHold={setShowOnHold}
        />
      </div>

      <SampleOrderList
        orders={ordersData?.data || []}
        totalPages={ordersData?.totalPages || 1}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        onOrdersChange={refetch}
      />
    </div>
  );
};