import { ChevronDown, ChevronUp, Trash2, Pencil, Check, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { Stage } from "@/components/StagesTimeline";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface StageHeaderProps {
  name: string;
  status: Stage["status"];
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (oldName: string, newName: string, newStatus: Stage["status"]) => void;
  isAdmin?: boolean;
  isDraggable?: boolean;
}

const getStatusColor = (status: Stage["status"]) => {
  switch (status) {
    case "completed":
      return "bg-emerald-100 text-emerald-700";
    case "in-progress":
      return "bg-blue-100 text-blue-700";
    case "pending":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

export const StageHeader = ({
  name,
  status,
  isOpen,
  onToggle,
  onDelete,
  onUpdate,
  isAdmin = false,
  isDraggable = false,
}: StageHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);

  const handleSave = () => {
    if (editedName.trim() !== "") {
      onUpdate(name, editedName, status);
      setIsEditing(false);
    }
  };

  const handleStatusChange = (newStatus: Stage["status"]) => {
    onUpdate(name, name, newStatus);
  };

  return (
    <div 
      className="flex items-center justify-between p-4 cursor-pointer group hover:bg-muted/5 transition-colors"
      onClick={onToggle}
    >
      <div className="flex items-center gap-3 flex-1">
        {isDraggable && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            <GripVertical className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
              <Button 
                variant="ghost" 
                size="sm" 
                className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}
              >
                {status.replace("-", " ")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => handleStatusChange("pending")}>
                <span className="text-purple-700">Pending</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("in-progress")}>
                <span className="text-blue-700">In Progress</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleStatusChange("completed")}>
                <span className="text-emerald-700">Completed</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          {isEditing ? (
            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
              <Input
                value={editedName}
                onChange={(e) => setEditedName(e.target.value)}
                className="h-7 w-[200px]"
                autoFocus
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSave}
                className="h-7 w-7 p-0"
              >
                <Check className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <h3 className="text-lg font-medium">{name}</h3>
          )}
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1">
          {isAdmin && !isEditing && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className="h-6 w-6 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete();
                }}
                className="h-6 w-6 p-0"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </>
          )}
        </div>
      </div>
      <div>
        {isOpen ? (
          <ChevronUp className="h-5 w-5" />
        ) : (
          <ChevronDown className="h-5 w-5" />
        )}
      </div>
    </div>
  );
};