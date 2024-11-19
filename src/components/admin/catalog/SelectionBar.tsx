import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";

interface SelectionBarProps {
  selectedCount: number;
  totalCount: number;
  selectAllPages: boolean;
  onSelectAllPages: (checked: boolean) => void;
  onDeleteClick: () => void;
  onDuplicateClick: () => void;
  productsInPage: number;
}

export const SelectionBar = ({
  selectedCount,
  totalCount,
  selectAllPages,
  onSelectAllPages,
  onDeleteClick,
  onDuplicateClick,
  productsInPage,
}: SelectionBarProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {selectAllPages ? `All ${totalCount} products selected` : `${selectedCount} product(s) selected`}
        </p>
        {selectedCount === productsInPage && !selectAllPages && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectAllPages(true)}
            className="text-primary hover:text-primary/90"
          >
            Select all {totalCount} products across all pages
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onDuplicateClick}
        >
          <Copy className="h-4 w-4 mr-2" />
          Duplicate Selected
        </Button>
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