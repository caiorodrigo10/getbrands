import { ChevronDown, ChevronUp, Trash2, Pencil, Check } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useState } from "react";
import { Stage } from "../StagesTimeline";

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

  return (
    <div className="flex items-center justify-between p-4 cursor-pointer group">
      <div className="flex items-center gap-3 flex-1">
        {isDraggable && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab">
            ⋮⋮
          </div>
        )}
        {isEditing ? (
          <div className="flex items-center gap-2">
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
      <div className="flex items-center gap-4">
        <span
          className={`text-sm ${
            status === "completed"
              ? "text-green-500"
              : status === "in-progress"
              ? "text-blue-500"
              : "text-gray-500"
          }`}
        >
          {status.replace("-", " ")}
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggle}
          className="p-0 hover:bg-transparent"
        >
          {isOpen ? (
            <ChevronUp className="h-5 w-5" />
          ) : (
            <ChevronDown className="h-5 w-5" />
          )}
        </Button>
      </div>
    </div>
  );
};