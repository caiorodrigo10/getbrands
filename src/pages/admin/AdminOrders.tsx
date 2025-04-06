
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { OrderStatusFilters } from "@/components/sample-orders/OrderStatusFilters";
import { useToast } from "@/components/ui/use-toast";
import { Loader } from "lucide-react";
import { OrderFilters } from "@/components/sample-orders/OrderFilters";

const AdminOrders = () => {
  const [activeStatus, setActiveStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const navigate = useNavigate();
  const { toast } = useToast();
  const startIndex = (currentPage - 1) * pageSize;
  
  const fetchOrderCount = async () => {
    // Construct the base query with filters
    let query = supabase
      .from("sample_requests")
      .select("id", { count: "exact" });
    
    // Apply status filter
    if (activeStatus !== "all") {
      query = query.eq("status", activeStatus);
    }
    
    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    
    const { count, error } = await query;
    
    if (error) throw error;
    return count || 0;
  };

  const fetchOrders = async () => {
    // Construct the base query for orders with related products
    let query = supabase
      .from("sample_requests")
      .select(`
        *,
        sample_request_products (
          *,
          product:product_id (*)
        ),
        user:user_id (*)
      `)
      .order("created_at", { ascending: false })
      .range(startIndex, startIndex + pageSize - 1);

    // Apply status filter
    if (activeStatus !== "all") {
      query = query.eq("status", activeStatus);
    }
    
    // Apply search filter if provided
    if (searchQuery) {
      query = query.or(`first_name.ilike.%${searchQuery}%,last_name.ilike.%${searchQuery}%,email.ilike.%${searchQuery}%`);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    // Get order totals from the sample_request_products
    const ordersWithTotals = await Promise.all(
      data.map(async (order) => {
        // Calculate the total using the actual products in the order
        const { count } = await supabase
          .rpc("get_user_role", { user_id: order.user_id })
          .select("count");
          
        return {
          ...order,
          itemCount: order.sample_request_products ? order.sample_request_products.length : 0,
        };
      })
    );
    
    return ordersWithTotals;
  };

  const { 
    data: orders = [], 
    isLoading, 
    error
  } = useQuery({
    queryKey: ["admin-orders", activeStatus, searchQuery, startIndex, pageSize],
    queryFn: fetchOrders
  });
  
  const { 
    data: totalOrders = 0, 
    isLoading: isCountLoading 
  } = useQuery({
    queryKey: ["admin-orders-count", activeStatus, searchQuery],
    queryFn: fetchOrderCount
  });
  
  const handleStatusChange = (newStatus: string) => {
    setActiveStatus(newStatus);
    setCurrentPage(1);
  };
  
  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };
  
  const totalPages = Math.ceil(totalOrders / pageSize);
  
  if (error) {
    toast({
      variant: "destructive",
      title: "Error",
      description: "Failed to fetch orders",
    });
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <h1 className="text-2xl font-bold mb-4 md:mb-0">Order Management</h1>
        <Button onClick={() => navigate("/admin/orders/export")}>
          Export Orders
        </Button>
      </div>

      <div className="mb-6">
        <Input
          placeholder="Search by customer name or email"
          value={searchQuery}
          onChange={handleSearch}
          className="max-w-md"
        />
      </div>

      <Tabs defaultValue="all" value={activeStatus} onValueChange={handleStatusChange}>
        <div className="mb-6 border-b">
          <TabsList className="bg-transparent">
            <TabsTrigger value="all" className="data-[state=active]:border-b-2 data-[state=active]:border-primary rounded-none">
              All Orders
            </TabsTrigger>
            <OrderStatusFilters />
          </TabsList>
        </div>
          
        <TabsContent value={activeStatus} className="mt-0">
          {isLoading || isCountLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <AdminOrdersTable orders={orders} totalOrders={totalOrders} />
              
              {totalPages > 1 && (
                <div className="flex justify-center mt-8">
                  <OrderFilters 
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={setCurrentPage}
                  />
                </div>
              )}
            </>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrders;
