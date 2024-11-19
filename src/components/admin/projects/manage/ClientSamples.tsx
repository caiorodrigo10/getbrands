import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import OrderStatusBadge from "@/components/sample-orders/OrderStatusBadge";
import { formatCurrency } from "@/lib/utils";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

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

  const calculateSubtotal = (order: any) => {
    return order.products?.reduce((total: number, item: any) => 
      total + (item.product.from_price || 0), 0) || 0;
  };

  const calculateShippingCost = (order: any) => {
    const totalItems = order.products?.length || 0;
    return 4.50 + Math.max(0, totalItems - 1) * 2;
  };

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
                      {formatCurrency(calculateSubtotal(request) + calculateShippingCost(request))}
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
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 border-t bg-gray-50">
                    <div className="space-y-4">
                      {request.products?.map((item: any) => (
                        <div key={item.product.id} className="flex items-start gap-3">
                          <img
                            src={item.product.image_url || "/placeholder.svg"}
                            alt={item.product.name}
                            className="w-16 h-16 object-cover rounded-md"
                          />
                          <div>
                            <h5 className="font-medium">{item.product.name}</h5>
                            <p className="text-sm font-medium mt-1">
                              {formatCurrency(item.product.from_price)}
                            </p>
                          </div>
                        </div>
                      ))}

                      <div className="pt-4 border-t space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Subtotal:</span>
                          <span>{formatCurrency(calculateSubtotal(request))}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Shipping:</span>
                          <span>{formatCurrency(calculateShippingCost(request))}</span>
                        </div>
                        <div className="flex justify-between font-medium pt-2 border-t">
                          <span>Total:</span>
                          <span>
                            {formatCurrency(calculateSubtotal(request) + calculateShippingCost(request))}
                          </span>
                        </div>
                      </div>

                      {request.tracking_number && (
                        <div className="pt-4 border-t">
                          <p className="text-sm font-medium">Tracking Number:</p>
                          <p className="text-sm">{request.tracking_number}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
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
