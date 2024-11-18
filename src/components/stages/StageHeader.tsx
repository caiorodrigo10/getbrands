import { useState } from "react";
import { ChevronDown, ChevronRight, Pencil, X, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface StageHeaderProps {
  name: string;
  status: "completed" | "in-progress" | "pending";
  isOpen: boolean;
  onToggle: () => void;
  onDelete: () => void;
  onUpdate: (oldName: string, newName: string, newStatus: "completed" | "in-progress" | "pending") => void;
  isAdmin?: boolean;
}

export const StageHeader = ({
  name,
  status,
  isOpen,
  onToggle,
  onDelete,
  onUpdate,
  isAdmin = false,
}: StageHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedStatus, setEditedStatus] = useState(status);

  const handleSave = () => {
    onUpdate(name, editedName, editedStatus);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedName(name);
    setEditedStatus(status);
    setIsEditing(false);
  };

  return (
    <div className="flex items-center justify-between p-4 bg-muted/5">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="sm"
          className="p-0 h-8 w-8"
          onClick={onToggle}
        >
          {isOpen ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {isEditing && isAdmin ? (
          <div className="flex items-center gap-2">
            <Input
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="h-8 w-48"
            />
            <Select
              value={editedStatus}
              onValueChange={(value: "completed" | "in-progress" | "pending") => 
                setEditedStatus(value)
              }
            >
              <SelectTrigger className="h-8 w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="in-progress">In Progress</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleSave}
              className="h-8 w-8 p-0"
            >
              <Check className="h-4 w-4 text-green-500" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCancel}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4 text-red-500" />
            </Button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="font-medium">{name}</span>
            {isAdmin && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(true)}
                className="h-8 w-8 p-0"
              >
                <Pencil className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};