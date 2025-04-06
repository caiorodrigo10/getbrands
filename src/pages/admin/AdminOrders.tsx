
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { Pagination } from "@/components/ui/pagination";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import OrderStatusFilters from "@/components/sample-orders/OrderStatusFilters";

interface AdminOrdersProps { }

const AdminOrders: React.FC<AdminOrdersProps> = () => {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [pageSize, setPageSize] = useState(10);

  const { toast } = useToast();

  const { data: ordersData, isLoading, error } = useQuery({
    queryKey: ["admin-orders", page, statusFilter, showOnHold, searchQuery, pageSize],
    queryFn: async () => {
      let query = supabase
        .from("sample_requests")
        .select("*", { count: "exact" })
        .range((page - 1) * pageSize, page * pageSize - 1)
        .order("created_at", { ascending: false });

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (showOnHold) {
        query = query.eq("status", "on_hold");
      }

      if (searchQuery) {
        query = query.ilike("product_name", `%${searchQuery}%`);
      }

      const { data, error, count } = await query;

      if (error) {
        throw error;
      }

      return {
        data,
        count: count || 0,
      };
    }
  });

  const totalOrders = ordersData?.count || 0;
  const orders = ordersData?.data || [];
  const pageCount = Math.ceil(totalOrders / pageSize);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch orders. Please try again.",
    });
  }

  return (
    <div className="container mx-auto py-6">
      <div className="mb-4 flex flex-col gap-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <h1 className="text-2xl font-semibold">Admin Orders</h1>
          <Input
            placeholder="Search by product or order number"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-md"
          />
        </div>

        <OrderStatusFilters
          selectedStatus={statusFilter}
          setSelectedStatus={setStatusFilter}
          showOnHold={showOnHold}
          setShowOnHold={setShowOnHold}
        />
      </div>

      {isLoading ? (
        <div className="space-y-2">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-10 w-32" />
        </div>
      ) : (
        <>
          <AdminOrdersTable orders={orders} totalOrders={totalOrders} />

          {totalOrders > 0 && (
            <div className="mt-4">
              <Pagination
                page={page}
                onPageChange={handlePageChange}
                pageCount={pageCount}
                pageSize={pageSize}
                setPageSize={setPageSize}
                totalItems={totalOrders}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AdminOrders;
