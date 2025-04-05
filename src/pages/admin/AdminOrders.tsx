
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

// Define interfaces for type safety
interface OrderProduct {
  id?: string;
  sample_request_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  product: {
    id: string;
    name: string;
    image_url: string | null;
    from_price?: number;
  };
}

interface OrderCustomer {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
}

interface Order {
  id: string;
  created_at: string;
  status: string;
  shipping_address?: string;
  shipping_city?: string;
  shipping_state?: string;
  shipping_zip?: string;
  tracking_number?: string | null;
  first_name?: string;
  last_name?: string;
  customer?: OrderCustomer;
  total?: number;
  subtotal?: number;
  shipping_cost?: number;
  total_items?: number;
  products?: OrderProduct[];
}

const AdminOrders = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["admin-orders", selectedStatus, currentPage],
    queryFn: async () => {
      try {
        // Get orders with customer info
        const { data: orders, error, count } = await supabase
          .from("sample_requests")
          .select(`
            *,
            customer:profiles(id, first_name, last_name, email)
          `, { count: 'exact' })
          .eq(selectedStatus !== "all" ? 'status' : 'id', selectedStatus !== "all" ? selectedStatus : 'id')
          .order('created_at', { ascending: false })
          .range((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE - 1);

        if (error) throw error;
        
        console.log("Fetched admin orders data:", orders);

        if (orders && orders.length > 0) {
          const orderIds = orders.map(order => order.id);
          
          // Count items per order - fixed query syntax
          const { data: itemCounts, error: countError } = await supabase
            .from('sample_request_products')
            .select('sample_request_id, count(*)')
            .in('sample_request_id', orderIds)
            // Use proper syntax for groupBy in Supabase JS client
            .group('sample_request_id');
            
          if (countError) throw countError;
          console.log("Item counts:", itemCounts);
          
          // Create a map of order ID to item count
          const itemCountMap: Record<string, number> = {};
          itemCounts?.forEach((item: any) => {
            itemCountMap[item.sample_request_id] = parseInt(item.count, 10);
          });
          
          // Add item count to each order
          const ordersWithTotalItems = orders.map(order => ({
            ...order,
            total_items: itemCountMap[order.id] || 0,
          }));
          
          // Get all products for these orders
          const { data: orderProducts, error: productsError } = await supabase
            .from('sample_request_products')
            .select(`
              id,
              sample_request_id,
              product_id,
              quantity,
              unit_price,
              product:products(*)
            `)
            .in('sample_request_id', orderIds);
            
          if (productsError) throw productsError;
          
          console.log("Order products data:", orderProducts);
          
          // Group products by order ID
          const orderProductsMap: Record<string, OrderProduct[]> = {};
          orderProducts?.forEach((item: any) => {
            if (!orderProductsMap[item.sample_request_id]) {
              orderProductsMap[item.sample_request_id] = [];
            }
            orderProductsMap[item.sample_request_id].push(item);
          });
          
          // Add products to each order
          const ordersWithProducts = ordersWithTotalItems.map(order => ({
            ...order,
            products: orderProductsMap[order.id] || [],
          }));

          return {
            data: ordersWithProducts,
            totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
            totalCount: count || 0,
            currentPage
          };
        }

        return {
          data: orders as Order[],
          totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
          totalCount: count || 0,
          currentPage
        };
      } catch (error) {
        console.error("Error fetching orders:", error);
        throw error;
      }
    }
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
