import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { Skeleton } from "@/components/ui/skeleton";

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: orders, isLoading } = useQuery({
    queryKey: ["admin-orders"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sample_requests")
        .select(`
          *,
          products: sample_request_products (
            product:products (
              id,
              name,
              image_url,
              from_price
            )
          ),
          customer:profiles (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-[400px] w-full" />
      </div>
    );
  }

  const filteredOrders = orders?.filter(order => {
    const searchLower = searchTerm.toLowerCase();
    const customerName = `${order.customer?.first_name} ${order.customer?.last_name}`.toLowerCase();
    const orderId = order.id.toLowerCase();
    
    return !searchTerm || 
      customerName.includes(searchLower) || 
      orderId.includes(searchLower);
  });

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all customer sample orders
        </p>
      </div>

      <div className="flex justify-between items-center">
        <Input
          placeholder="Search orders..."
          className="max-w-xs"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <AdminOrdersTable orders={filteredOrders || []} />
    </div>
  );
};

export default AdminOrders;