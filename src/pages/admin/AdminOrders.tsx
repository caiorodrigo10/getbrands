
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { supabaseAdmin } from "@/lib/supabase/admin";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Users } from "lucide-react";
import AdminPagination from "@/components/admin/AdminPagination";
import { useUserPermissions } from "@/lib/permissions";

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentTab, setCurrentTab] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const { isAdmin } = useUserPermissions();
  
  const handleTabChange = (value: string) => {
    setCurrentTab(value);
    setPage(1);
  };

  const { data, isLoading } = useQuery({
    queryKey: ["admin-orders", currentTab, searchTerm, page, pageSize, isAdmin],
    queryFn: async () => {
      if (!isAdmin) {
        console.error("Unauthorized access to admin orders");
        return { orders: [], totalOrders: 0, pageCount: 0 };
      }

      // Calculate the range for pagination
      const from = (page - 1) * pageSize;
      const to = from + pageSize - 1;

      console.log("Fetching admin orders with:", { currentTab, searchTerm, page, from, to });

      try {
        // Use supabaseAdmin for admin operations
        let query = supabaseAdmin
          .from("sample_requests")
          .select(`
            *,
            profile:profiles(first_name, last_name, email),
            product:products(*),
            items:sample_request_products(
              id, 
              quantity, 
              unit_price,
              product:products(*)
            )
          `, { count: 'exact' });
        
        // Apply filters
        if (currentTab !== "all") {
          query = query.eq("status", currentTab);
        }
        
        if (searchTerm) {
          query = query.or(`first_name.ilike.%${searchTerm}%,last_name.ilike.%${searchTerm}%,profiles.email.ilike.%${searchTerm}%`);
        }
        
        // Apply pagination
        const { data: orders, error, count } = await query
          .order('created_at', { ascending: false })
          .range(from, to);

        if (error) {
          console.error("Error fetching admin orders:", error);
          throw error;
        }

        console.log("Admin orders fetched successfully:", { count, resultsLength: orders?.length });
        
        return {
          orders: orders || [],
          totalOrders: count || 0,
          pageCount: Math.ceil((count || 0) / pageSize)
        };
      } catch (err) {
        console.error("Unexpected error in admin orders query:", err);
        return { orders: [], totalOrders: 0, pageCount: 0 };
      }
    },
    enabled: !!isAdmin,
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1); // Reset to first page on new search
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h1 className="text-3xl font-bold">Orders</h1>
        <form 
          onSubmit={handleSearch}
          className="relative w-full md:w-auto"
        >
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search orders..."
            className="pl-9 w-full md:w-[300px]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
      </div>

      <Tabs value={currentTab} onValueChange={handleTabChange}>
        <div className="flex flex-col sm:flex-row justify-between">
          <TabsList className="mb-4 sm:mb-0">
            <TabsTrigger value="all">All Orders</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="processing">Processing</TabsTrigger>
            <TabsTrigger value="shipped">Shipped</TabsTrigger>
            <TabsTrigger value="delivered">Delivered</TabsTrigger>
            <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={currentTab} className="mt-4">
          <Card>
            <CardHeader className="px-6 pb-2">
              <CardTitle className="text-lg flex items-center gap-2">
                <Users className="h-5 w-5 text-muted-foreground" />
                {isLoading 
                  ? "Loading orders..." 
                  : `${data?.totalOrders || 0} ${currentTab === 'all' ? 'Total' : currentTab} Orders`
                }
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoading ? (
                <div className="flex items-center justify-center p-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
              ) : (
                <>
                  <AdminOrdersTable 
                    orders={data?.orders || []} 
                    totalOrders={data?.totalOrders || 0}
                  />
                  {data?.pageCount && data.pageCount > 1 && (
                    <div className="px-6">
                      <AdminPagination
                        page={page}
                        pageCount={data?.pageCount || 1}
                        pageSize={pageSize}
                        setPageSize={setPageSize}
                        onPageChange={handlePageChange}
                        totalItems={data?.totalOrders || 0}
                      />
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminOrders;
