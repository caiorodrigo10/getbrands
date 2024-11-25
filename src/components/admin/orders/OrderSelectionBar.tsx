import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface OrderSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  selectAllPages: boolean;
  onSelectAllPages: (checked: boolean) => void;
  onDeleteClick: () => void;
  ordersInPage: number;
}

export const OrderSelectionBar = ({
  selectedCount,
  totalCount,
  selectAllPages,
  onSelectAllPages,
  onDeleteClick,
  ordersInPage,
}: OrderSelectionBarProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {selectAllPages ? `All ${totalCount} orders selected` : `${selectedCount} order(s) selected`}
        </p>
        {selectedCount === ordersInPage && !selectAllPages && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectAllPages(true)}
            className="text-primary hover:text-primary/90"
          >
            Select all {totalCount} orders across all pages
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="destructive"
          size="sm"
          onClick={onDeleteClick}
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Selected
        </Button>
      </div>
    </div>
  );
};