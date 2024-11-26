import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import OrderStatusBadge from "@/components/sample-orders/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils";
import { calculateOrderSubtotal, calculateShippingCost, calculateOrderTotal } from "@/lib/orderCalculations";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { OrderSummarySection } from "./OrderSummarySection";
import { OrderDetailsSection } from "./OrderDetailsSection";

interface ClientSamplesProps {
  userId: string | undefined;
}

const ITEMS_PER_PAGE = 7;

export const ClientSamples = ({ userId }: ClientSamplesProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrderId, setExpandedOrderId] = useState<string | null>(null);

  const { data: sampleRequests } = useQuery({
    queryKey: ["client-samples", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("sample_requests")
        .select(`
          *,
          products: sample_request_products (
            product: products (
              name,
              image_url,
              from_price
            )
          )
        `)
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!userId,
  });

  const toggleOrderExpansion = (orderId: string) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (!userId || !sampleRequests?.length) {
    return (
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">Sample Requests</h2>
        <p className="text-muted-foreground">No sample requests yet.</p>
      </Card>
    );
  }

  const totalPages = Math.ceil(sampleRequests.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentRequests = sampleRequests.slice(startIndex, endIndex);

  return (
    <Card className="p-6">
      <h2 className="text-lg font-semibold mb-6">Sample Requests</h2>
      <div className="space-y-4">
        {currentRequests.map((request) => (
          <div key={request.id} className="border rounded-lg overflow-hidden">
            <div className="p-4 bg-card">
              <div className="flex items-center justify-between">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1">
                  <div>
                    <p className="text-sm font-medium">Order #{request.id.slice(0, 8)}</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(request.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Items</p>
                    <p className="text-sm text-muted-foreground">
                      {request.products?.length || 0} products
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Status</p>
                    <OrderStatusBadge status={request.status} />
                  </div>
                  <div>
                    <p className="text-sm font-medium">Total</p>
                    <p className="text-sm text-muted-foreground">
                      {formatCurrency(calculateOrderTotal(request.products || []))}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleOrderExpansion(request.id)}
                  className="ml-4"
                >
                  {expandedOrderId === request.id ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
            <AnimatePresence>
              {expandedOrderId === request.id && (
                <OrderDetailsSection 
                  request={request}
                  subtotal={calculateOrderSubtotal(request.products || [])}
                  shippingCost={calculateShippingCost(request.products || [])}
                />
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="mt-6">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    onClick={() => setCurrentPage(page)}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </Card>
  );
};