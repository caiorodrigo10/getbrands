import { Check, Clock, Pencil } from "lucide-react";
import { useState } from "react";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Button } from "../ui/button";

interface StageHeaderProps {
  name: string;
  status: "completed" | "in-progress" | "pending";
  onUpdateStage?: (newName: string, newStatus: "completed" | "in-progress" | "pending") => void;
}

export const StageHeader = ({ name, status, onUpdateStage }: StageHeaderProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [editedStatus, setEditedStatus] = useState(status);

  const handleSave = () => {
    if (editedName.trim() && onUpdateStage) {
      onUpdateStage(editedName, editedStatus);
      setIsEditing(false);
    }
  };

  if (isEditing) {
    return (
      <div className="flex items-center gap-3">
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          className="h-7 w-[200px]"
          autoFocus
        />
        <Select value={editedStatus} onValueChange={(value: "completed" | "in-progress" | "pending") => setEditedStatus(value)}>
          <SelectTrigger className="h-7 w-[130px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in-progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleSave}
          className="h-7 w-7 p-0"
        >
          <Check className="h-4 w-4" />
        </Button>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 group">
      <div className={`relative flex-shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
        status === "completed" 
          ? "border-primary bg-primary text-white" 
          : status === "in-progress"
          ? "border-primary-light bg-primary-light/10"
          : "border-muted bg-muted/10"
      }`}>
        {status === "completed" ? (
          <Check className="w-3 h-3" />
        ) : status === "in-progress" ? (
          <Clock className="w-3 h-3 text-primary-light" />
        ) : (
          <div className="w-1.5 h-1.5 bg-muted rounded-full" />
        )}
      </div>
      
      <div className="flex-grow min-w-0 flex items-center gap-2">
        <span className={`text-sm font-medium ${
          status === "completed" ? "text-foreground" :
          status === "in-progress" ? "text-foreground" : "text-muted-foreground"
        }`}>
          {name}
        </span>
        {onUpdateStage && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsEditing(true)}
            className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Pencil className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};