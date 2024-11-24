import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface CRMSelectionBarProps {
  selectedCount: number;
  onDeleteClick: () => void;
}

export const CRMSelectionBar = ({
  selectedCount,
  onDeleteClick,
}: CRMSelectionBarProps) => {
  return (
    <div className="flex items-center justify-between p-4 bg-white border rounded-md shadow-sm">
      <div className="flex items-center gap-4">
        <p className="text-sm text-muted-foreground">
          {selectedCount} user(s) selected
        </p>
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