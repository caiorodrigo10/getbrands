import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderFilters from "@/components/sample-orders/OrderFilters";
import OrderTable from "@/components/sample-orders/OrderTable";

const SampleOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);

  const { data: orders, isLoading } = useQuery({
    queryKey: ["sample-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sample_requests")
        .select(`
          *,
          product:products(*)
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const filteredOrders = orders?.filter((order) => {
    const matchesSearch =
      !searchQuery ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.product?.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      selectedStatus === "all" || order.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-4xl font-bold">My Sample Orders</h1>
        <p className="text-gray-600 mt-2">View and track your sample orders</p>
      </div>

      <OrderFilters
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        showOnHold={showOnHold}
        setShowOnHold={setShowOnHold}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
      />

      <OrderTable orders={filteredOrders} />
    </div>
  );
};

export default SampleOrders;