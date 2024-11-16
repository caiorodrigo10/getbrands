import { MoreHorizontal, Trash2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";

interface StageActionsProps {
  onDeleteStage: () => void;
}

export const StageActions = ({ onDeleteStage }: StageActionsProps) => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem className="text-destructive" onClick={onDeleteStage}>
          <Trash2 className="h-4 w-4 mr-2" />
          Delete Stage
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};