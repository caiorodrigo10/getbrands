
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import AdminOrdersTable from "@/components/admin/orders/AdminOrdersTable";
import { Skeleton } from "@/components/ui/skeleton";
import OrderStatusFilters from "@/components/sample-orders/OrderStatusFilters";
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 10;

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders", selectedStatus, currentPage],
    queryFn: async () => {
      // First, build the initial query
      let query = supabase
        .from("sample_requests")
        .select(`
          *,
          customer:profiles(id, first_name, last_name, email),
          total_items:sample_request_products(count)
        `, { count: 'exact' });

      // Apply status filter if not "all"
      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      // Calculate pagination range
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      // Execute the query with pagination
      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      console.log("Fetched admin orders data:", data);

      // Fetch product details for each order in a second query
      if (data && data.length > 0) {
        const orderIds = data.map(order => order.id);
        
        // Fetch order products with detailed product information
        const { data: orderProductsData, error: orderProductsError } = await supabase
          .from('sample_request_products')
          .select(`
            *,
            sample_request_id,
            product:products(*)
          `)
          .in('sample_request_id', orderIds);
          
        if (orderProductsError) throw orderProductsError;
        
        console.log("Order products data:", orderProductsData);
        
        // Organize product data by order
        const orderProductsMap = {};
        orderProductsData?.forEach(item => {
          if (!orderProductsMap[item.sample_request_id]) {
            orderProductsMap[item.sample_request_id] = [];
          }
          orderProductsMap[item.sample_request_id].push(item);
        });
        
        // Add products to each order
        data.forEach(order => {
          order.products = orderProductsMap[order.id] || [];
        });
      }

      return {
        data,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        totalCount: count || 0,
        currentPage
      };
    },
  });

  const filteredOrders = ordersData?.data?.filter(order => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    const customerName = `${order.customer?.first_name} ${order.customer?.last_name}`.toLowerCase();
    const orderId = `SPL${order.id.slice(0, 6)}`.toLowerCase();
    const customerEmail = order.customer?.email?.toLowerCase() || '';
    
    return customerName.includes(searchLower) || 
           orderId.includes(searchLower) ||
           customerEmail.includes(searchLower);
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

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Orders Management</h1>
        <p className="text-muted-foreground mt-2">
          View and manage all customer sample orders
        </p>
      </div>

      <div className="space-y-4">
        <OrderStatusFilters
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          showOnHold={showOnHold}
          setShowOnHold={setShowOnHold}
        />

        <div className="flex justify-between items-center">
          <Input
            placeholder="Search by customer name, email or order number..."
            className="max-w-md"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <AdminOrdersTable 
        orders={filteredOrders || []} 
        totalOrders={ordersData?.totalCount}
      />

      {ordersData?.totalPages && ordersData.totalPages > 1 && (
        <div className="flex justify-center mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
              
              {Array.from({ length: ordersData.totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                    className="cursor-pointer"
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage(Math.min(ordersData.totalPages, currentPage + 1))}
                  className={currentPage === ordersData.totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
