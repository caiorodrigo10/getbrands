import OrderTable from "@/components/sample-orders/OrderTable";
import CatalogPagination from "@/components/catalog/CatalogPagination";

interface SampleOrderListProps {
  orders: any[];
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
  onOrdersChange: () => void;
}

export const SampleOrderList = ({
  orders,
  totalPages,
  currentPage,
  onPageChange,
  onOrdersChange,
}: SampleOrderListProps) => {
  if (!orders || orders.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-gray-600">No orders found.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <OrderTable orders={orders} onOrdersChange={onOrdersChange} />
      </div>
      
      {totalPages > 1 && (
        <div className="mt-6 flex justify-center">
          <CatalogPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={onPageChange}
          />
        </div>
      )}
    </div>
  );
};