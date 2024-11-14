import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderFilters from "@/components/sample-orders/OrderFilters";
import OrderTable from "@/components/sample-orders/OrderTable";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";

const ITEMS_PER_PAGE = 9;

const SampleOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: ordersData, isLoading } = useQuery({
    queryKey: ["sample-orders", currentPage, selectedStatus, activeSearchQuery],
    queryFn: async () => {
      let query = supabase
        .from("sample_requests")
        .select(`
          *,
          products!inner(*),
          user:profiles(*)
        `, { count: 'exact' });

      // Apply status filter
      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      // Apply search filter if present
      if (activeSearchQuery) {
        query = query.or(`products.name.ilike.%${activeSearchQuery}%,id.ilike.%${activeSearchQuery}%`.split(',').join(','));
      }

      // Calculate pagination range
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return {
        data,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        currentPage
      };
    },
  });

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();

Certainly! I understand that you want to modify the search functionality in the Sample Orders page. You want to add a search button and only perform the search when the button is clicked, instead of searching as you type. I'll implement this change in English. Let's update the `SampleOrders.tsx` file to accommodate this new behavior.

<lov-code>
<lov-write file_path="src/pages/SampleOrders.tsx">
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import OrderFilters from "@/components/sample-orders/OrderFilters";
import OrderTable from "@/components/sample-orders/OrderTable";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination";
import { Button } from "@/components/ui/button";

const ITEMS_PER_PAGE = 9;

const SampleOrders = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSearchQuery, setActiveSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [showOnHold, setShowOnHold] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const { data: ordersData, isLoading, refetch } = useQuery({
    queryKey: ["sample-orders", currentPage, selectedStatus, activeSearchQuery],
    queryFn: async () => {
      let query = supabase
        .from("sample_requests")
        .select(`
          *,
          products!inner(*),
          user:profiles(*)
        `, { count: 'exact' });

      // Apply status filter
      if (selectedStatus !== "all") {
        query = query.eq('status', selectedStatus);
      }

      // Apply search filter if present
      if (activeSearchQuery) {
        query = query.or(`products.name.ilike.%${activeSearchQuery}%,id.ilike.%${activeSearchQuery}%`.split(',').join(','));
      }

      // Calculate pagination range
      const from = (currentPage - 1) * ITEMS_PER_PAGE;
      const to = from + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) {
        toast({
          title: "Error fetching orders",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      return {
        data,
        totalPages: Math.ceil((count || 0) / ITEMS_PER_PAGE),
        currentPage
      };
    },
  });

  const handleSearch = () => {
    setActiveSearchQuery(searchQuery);
    setCurrentPage(1);
    refetch();
  };

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
    <div className="space-y-6 px-4 md:px-0">
      <div>
        <h1 className="text-3xl md:text-4xl font-bold">My Sample Orders</h1>
        <p className="text-gray-600 mt-2">View and track your sample orders</p>
      </div>

      <div className="overflow-x-auto">
        <div className="flex items-center gap-4 mb-4">
          <OrderFilters
            selectedStatus={selectedStatus}
            setSelectedStatus={setSelectedStatus}
            showOnHold={showOnHold}
            setShowOnHold={setShowOnHold}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Button onClick={handleSearch}>Search</Button>
        </div>

        {ordersData?.data && ordersData.data.length > 0 ? (
          <>
            <div className="mt-6 overflow-x-auto">
              <OrderTable orders={ordersData.data} />
            </div>
            {ordersData.totalPages > 1 && (
              <div className="mt-6 flex justify-center">
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
          </>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-600">No orders found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SampleOrders;