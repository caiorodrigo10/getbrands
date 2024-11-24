import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CRMSelectionBarProps {
  selectedCount: number;
  totalCount: number;
  selectAllPages: boolean;
  onSelectAllPages: (checked: boolean) => void;
  onDeleteClick: () => void;
  usersInPage: number;
}

export const CRMSelectionBar = ({
  selectedCount,
  totalCount,
  selectAllPages,
  onSelectAllPages,
  onDeleteClick,
  usersInPage,
}: CRMSelectionBarProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {selectAllPages ? `All ${totalCount} users selected` : `${selectedCount} user(s) selected`}
        </p>
        {selectedCount === usersInPage && !selectAllPages && (
          <Button
            variant="link"
            size="sm"
            onClick={() => onSelectAllPages(true)}
            className="text-primary hover:text-primary/90"
          >
            Select all {totalCount} users across all pages
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